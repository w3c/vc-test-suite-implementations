/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
import {constructOAuthHeader} from './oauth2.js';
import {agent, didKeyDriver} from './constants.js';
import {ZcapClient} from '@digitalbazaar/ezcap';
import {decodeSecretKeySeed} from 'bnid';
import {
  Ed25519Signature2020
} from '@digitalbazaar/ed25519-signature-2020';
import {httpClient} from '@digitalbazaar/http-client';

const defaultHeaders = {
  Accept: 'application/json, application/ld+json, */*'
};

const postHeaders = {
  'Content-Type': 'application/json',
  ...defaultHeaders
};

const _getZcapClient = async ({secretKeySeed}) => {
  const seed = await decodeSecretKeySeed({secretKeySeed});
  const didKey = await didKeyDriver.generate({seed});
  const {didDocument: {capabilityInvocation}} = didKey;
  return new ZcapClient({
    SuiteClass: Ed25519Signature2020,
    invocationSigner: didKey.keyPairs.get(capabilityInvocation[0]).signer(),
    agent
  });
};

export async function zcapRequest({
  endpoint,
  json,
  zcap,
  headers = defaultHeaders
}) {
  let result;
  let error;
  let capability = zcap.capability;
  // we are storing the zcaps stringified right now
  if(typeof capability === 'string') {
    capability = JSON.parse(capability);
  }
  try {
    // assume that the clientSecret is set in the test environment
    const secretKeySeed = process.env[zcap.clientSecret];
    if(!secretKeySeed) {
      console.warn(`ENV variable ${zcap.clientSecret} is required.`);
    }
    const zcapClient = await _getZcapClient({secretKeySeed});
    result = await zcapClient.write({
      url: endpoint,
      json,
      headers: {
        ...postHeaders,
        // passed in headers will overwrite postHeaders
        ...headers
      },
      capability
    });
  } catch(e) {
    error = e;
  }
  const {data, statusCode} = _getDataAndStatus({result, error});
  return {result, error, data, statusCode};
}

function _getDataAndStatus({result = {}, error = {}}) {
  let data = result.data || error.data;
  // FIXME remove this once VC-API returns from the issuer
  // are finalized.
  if(data && data.verifiableCredential) {
    data = data.verifiableCredential;
  }
  const statusCode = result.status || error.status;
  return {data, statusCode};
}

function _deleteAuthorizationHeader({error}) {
  if(error.response) {
    const {headers: responseHeaders} = error.response;
    // Clone the response headers
    const newHeaders = new global.Headers(responseHeaders);
    // delete the Authorization header to prevent
    // oauth2 headers potentially in logs
    newHeaders.delete('Authorization');
    const newResponse = new global.Response(error.response, {
      headers: newHeaders
    });
    error.response = newResponse;
  }
  return error;
}

/**
 * Makes an https request.
 *
 * @param {object} options - Options to use.
 * @param {URL} options.url - A url.
 * @param {object} [options.json] - JSON for the request.
 * @param {object} [options.headers] - Headers for the request.
 * @param {string} options.method - The HTTP method for the request.
 * @param {object} [options.oauth2] - OAuth2 creds.
 * @param {object} [options.searchParams] - URL Queries for the request.
 *
 * @returns {object} The results from the request.
 */
export async function makeHttpsRequest({
  url,
  json,
  headers,
  method,
  oauth2,
  searchParams
}) {
  let result;
  let error;
  if(oauth2) {
    headers.Authorization = await constructOAuthHeader({...oauth2});
  }
  try {
    result = await httpClient(url, {
      method, json, headers, agent, searchParams
    });
  } catch(e) {
    error = _deleteAuthorizationHeader({error: e});
  }
  const {data, statusCode} = _getDataAndStatus({result, error});
  return {result, error, data, statusCode};
}
