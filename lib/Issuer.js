/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
const {httpClient} = require('@digitalbazaar/http-client');
const {ZcapClient} = require('@digitalbazaar/ezcap');
const https = require('https');
const didKey = require('@digitalbazaar/did-method-key');
const {decodeSecretKeySeed} = require('bnid');
const {Ed25519Signature2020} = require('@digitalbazaar/ed25519-signature-2020');

const agent = new https.Agent({rejectUnauthorized: false});
const didKeyDriver = didKey.driver();

class Issuer {
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
}

async function _httpRequest({endpoint, json, headers = {}, oath2}) {
  let result;
  let error;
  if(oath2) {
    headers.Authorization = await constructOAuthHeader({...oath2});
    console.log(headers);
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

async function _zcapClientRequest({endpoint, zcap, json}) {
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
      agent,
      capability
    });
  } catch(e) {
    error = e;
  }
  return {result, error};
}

async function constructOAuthHeader({
  clientId,
  clientSecret,
  tokenAudience,
  tokenEndpoint
}) {
  const client_secret = process.env[clientSecret];
  if(!client_secret) {
    throw new Error(`Env variable ${clientSecret} not set.`);
  }
  const {accessToken} = await _getNewAccessToken({
    client_id: clientId,
    client_secret,
    token_endpoint: tokenEndpoint,
    audience: tokenAudience,
    grant_type: 'client_credentials'
  });
  return `Bearer ${accessToken}`;
}

/**
 * Gets a new access token from the provided URL.
 *
 * @param {object} options - Options to use.
 * @param {string} options.client_id - The ID of the client.
 * @param {string} options.client_secret - The client secret.
 * @param {string} options.token_endpoint - The URL to call.
 * @param {string} options.grant_type - The grant type.
 * @param {number} options.maxRetries - The maximum number of times to retry
 *  the request.
 * @param {string} options.audience - The URL of resource server.
 *
 * @returns {object} The access token.
 */
async function _getNewAccessToken({
  client_id, client_secret, token_endpoint, grant_type, audience,
  maxRetries = 3
}) {
  // FIXME other implementations appear to post json
  const body = new URLSearchParams({
    client_id, client_secret, grant_type
  });

  for(; maxRetries >= 0; --maxRetries) {
    const access_token = await _requestAccessToken(
      {url: token_endpoint, body});
    if(access_token) {
      return {accessToken: access_token};
    }
  }
  throw new Error(
    `Service Unavailable: Could not renew token for ${audience}.`);
}

async function _requestAccessToken({url, body}) {
  let response;
  try {
    ({data: response} = await httpClient.post(url, {
      body,
      agent
    }));
  } catch(error) {
    console.error('Error getting access token.', {error});
    throw error;
  }
  if(response && response.access_token) {
    return response.access_token;
  }

  return false;
}

module.exports = {Issuer};
