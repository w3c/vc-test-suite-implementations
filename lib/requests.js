/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
import {
  agent,
  defaultHeaders,
  didKeyDriver,
  postHeaders,
  sanitizeHeaders
} from './constants.js';
import {constructOAuthHeader} from './oauth2.js';
import {decodeSecretKeySeed} from 'bnid';
import {Ed25519Signature2020} from '@digitalbazaar/ed25519-signature-2020';
import {httpClient} from '@digitalbazaar/http-client';
import {ZcapClient} from '@digitalbazaar/ezcap';

/**
 * Makes an https request.
 *
 * @param {object} options - Options to use.
 * @param {URL} options.url - A url.
 * @param {object} [options.json] - JSON for the request.
 * @param {object} [options.body] - A body for the request.
 * @param {object} [options.headers] - Headers for the request.
 * @param {string} options.method - The HTTP method for the request.
 * @param {object} [options.oauth2] - OAuth2 credentialss.
 * @param {object} [options.searchParams] - URL Queries for the request.
 *
 * @returns {object} The results from the request.
 */
export async function makeHttpsRequest({
  url,
  json,
  body,
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
      body, method, json, headers, agent, searchParams
    });
  } catch(e) {
    error = _deleteErrorHeaders({error: e});
  }
  const {data, statusCode} = _getDataAndStatus({result, error});
  // if a result is returned sanitize it
  if(result) {
    result = _deleteResponseHeaders({response: result});
  }
  return {result, error, data, statusCode};
}

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
    error = _deleteErrorHeaders({error: e});
  }
  const {data, statusCode} = _getDataAndStatus({result, error});
  // if a result is returned sanitize it
  if(result) {
    result = _deleteResponseHeaders({response: result});
  }
  return {result, error, data, statusCode};
}

async function _getZcapClient({secretKeySeed}) {
  const seed = await decodeSecretKeySeed({secretKeySeed});
  const didKey = await didKeyDriver.generate({seed});
  const {didDocument: {capabilityInvocation}} = didKey;
  return new ZcapClient({
    SuiteClass: Ed25519Signature2020,
    invocationSigner: didKey.keyPairs.get(capabilityInvocation[0]).signer(),
    agent
  });
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

function _deleteErrorHeaders({error}) {
  if(error.response) {
    error.response = _deleteResponseHeaders({response: error.response});
  }
  if(error.request) {
    error.request = new global.Request(error.request, {
      headers: _deleteHeaders({httpMessage: error.request})
    });
  }
  return error;
}

function _deleteResponseHeaders({response}) {
  const newResponse = new global.Response(JSON.stringify(response.data), {
    headers: _deleteHeaders({httpMessage: response}),
    status: response.status,
    statusText: response.statusText
  });
  if(response.data) {
    // transfer the already parsed data to the newResponse
    // we are overwriting the data getter in Response here
    Object.defineProperty(newResponse, 'data', {value: response.data});
  }
  return newResponse;
}

/**
 * Takes in either a response or request & sanitizes the headers.
 *
 * @private
 *
 * @param {object} options - Options to use.
 * @param {global.Response|global.Request} options.httpMessage - A http message.
 * @param {Array<string>} [options.headers=sanitizeHeaders] - A list of headers
 *   to delete from the http message.
 *
 * @returns {global.Headers} - Returns http headers.
 */
function _deleteHeaders({httpMessage, headers = sanitizeHeaders}) {
  if(!httpMessage) {
    return new global.Headers();
  }
  const {headers: messageHeaders} = httpMessage;
  // Clone the response headers
  const newHeaders = new global.Headers(messageHeaders);
  for(const header of headers) {
    // delete the headers to prevent
    // authn tokens / information potentially in logs
    newHeaders.delete(header);
  }
  return newHeaders;
}
