/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */

import {constructOAuthHeader} from './oauth2';
import {agent, didKeyDriver} from './constants.js';
import {ZcapClient} from '@digitalbazaar/ezcap/lib/main.js';
import {decodeSecretKeySeed} from 'bnid/main.js';
import {
  Ed25519Signature2020
} from '@digitalbazaar/ed25519-signature-2020/lib/main.js';
import {httpClient} from '@digitalbazaar/http-client/main.js';

export async function httpRequest({endpoint, json, oauth2, headers = {}}) {
  let result;
  let error;
  if(oauth2) {
    headers.Authorization = await constructOAuthHeader({...oauth2});
  }
  try {
    result = await httpClient.post(
      endpoint,
      {
        json,
        agent,
        headers: {...headers}
      });
  } catch(e) {
    // delete the Authorization header to prevent
    // oauth2 headers potentially in logs
    if(e.response) {
      e.response.headers.delete('Authorization');
    }
    error = e;
  }
  const {data, statusCode} = _getDataAndStatus({result, error});
  return {result, error, data, statusCode};
}

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

export async function zcapRequest({endpoint, json, zcap, headers = {}}) {
  let result;
  let error;
  let capability;
  if(endpoint.endsWith('/publish')) {
    capability = zcap.slcsCapability;
  } else {
    capability = zcap.capability;
  }
  // we are storing the zcaps stringified right now
  if(typeof capability === 'string') {
    capability = JSON.parse(capability);
  }
  try {
    // assume that the clientSecret is set in the test environment
    const secretKeySeed = process.env[zcap.clientSecret];
    const zcapClient = await _getZcapClient({secretKeySeed});
    result = await zcapClient.write({
      url: endpoint,
      json,
      headers: {...headers},
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
