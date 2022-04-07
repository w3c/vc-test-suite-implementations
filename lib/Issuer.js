/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
import {httpClient} from '@digitalbazaar/http-client/main.js';
import {ZcapClient} from '@digitalbazaar/ezcap/lib/main.js';
import {decodeSecretKeySeed} from 'bnid/main.js';
import {
  Ed25519Signature2020
} from '@digitalbazaar/ed25519-signature-2020/lib/main.js';
import {constructOAuthHeader} from './oath2';
import {agent, didKeyDriver} from './constants.js';

export class Issuer {
  constructor({oath2, issuer}) {
    this.oath2 = oath2;
    this.issuer = issuer;
  }
  /**
   * Issues a VC from an endpoint.
   *
   * @param {object} options - Options to use.
   * @param {object} options.body - The body for the request.
   *
   * @returns {Promise<object>} Contains the result and error.
   */
  async issue({body}) {
    const {issuer, oath2} = this;
    if(issuer.zcap) {
      return _zcapClientRequest({
        ...issuer,
        json: body
      });
    }
    return _httpRequest({
      ...issuer,
      oath2,
      json: body
    });
  }
  async setStatus({body}) {
    const headers = {
      ...this.settings.issuer.headers
    };
    try {
      let result;
      if(this.settings.issuer.zcap) {
        result = await _zcapClientRequest({
          endpoint: this.settings.issuer.statusEndpoint,
          zcap: this.settings.zcap,
          json: body
        });
      } else {
        result = await httpClient.post(
          this.settings.issuer.statusEndpoint,
          {headers, agent, json: body});
      }
      return result;
    } catch(e) {
      console.log(e);
      throw e;
    }
  }
}

async function _httpRequest({endpoint, json, oath2, headers = {}}) {
  let result;
  let error;
  if(oath2) {
    headers.Authorization = await constructOAuthHeader({...oath2});
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
    // oath2 headers in reports
    if(e.response) {
      e.response.headers.delete('Authorization');
    }
    error = e;
  }
  return {result, error};
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

async function _zcapClientRequest({endpoint, json, zcap, headers = {}}) {
  let result;
  let error;
  let capability = zcap.capability;
  // we are storing the zcaps stringified right now
  if(typeof zcap.capability === 'string') {
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
  return {result, error};
}
