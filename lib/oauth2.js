/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
import LruCache from 'lru-cache';
import {makeHttpsRequest} from './requests.js';

// the default access token times out in one hour in seconds
const ttl = 60 * 60 * 1000; // one hour (in milliseconds)
// caches 50 access tokens max with a ttl of one hour
const accessTokenCache = new LruCache({max: 50, ttl});

export async function constructOAuthHeader({
  clientId,
  clientSecret,
  tokenAudience,
  tokenEndpoint,
  scopes
}) {
  const client_secret = process.env[clientSecret];
  if(!client_secret) {
    console.warn(`Env variable ${clientSecret} not set.`);
    return;
  }
  const {accessToken} = await _getNewAccessToken({
    client_id: clientId,
    client_secret,
    token_endpoint: tokenEndpoint,
    audience: tokenAudience,
    grant_type: 'client_credentials',
    scopes
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
 * @param {Array<string>} options.scopes - Scopes for the request.
 *
 * @returns {object} The access token.
 */
async function _getNewAccessToken({
  client_id,
  client_secret,
  token_endpoint,
  grant_type,
  audience,
  scopes,
  maxRetries = 3
}) {
  const cachedAccessToken = accessTokenCache.get(client_id + scopes);
  if(cachedAccessToken) {
    return {accessToken: cachedAccessToken};
  }
  const body = new URLSearchParams({
    client_id,
    client_secret,
    grant_type,
    audience,
  });
  // scopes are space separated
  if(scopes && scopes.length > 0) {
    body.append('scopes', scopes.join(' '));
  }
  for(; maxRetries >= 0; --maxRetries) {
    const {
      access_token,
      expires_in = ttl
    } = await _requestAccessToken({url: token_endpoint, body});
    if(access_token) {
      // convert seconds expires_in to milliseconds ttl for cache
      const options = {ttl: expires_in * 1000};
      accessTokenCache.set(client_id + scopes, access_token, options);
      return {accessToken: access_token};
    }
  }
  throw new Error(
    `Service Unavailable: Could not renew token for ${audience}.`);
}

async function _requestAccessToken({url, body}) {
  let data;
  try {
    const {data: responseData, error} = await makeHttpsRequest({
      url,
      method: 'post',
      body
    });
    // this error is sanitized and can be thrown
    if(error) {
      throw error;
    }
    data = responseData;
  } catch(error) {
    console.error('Error getting access token.', {error});
    throw error;
  }
  if(data && data.access_token) {
    return data;
  }
  return {};
}
