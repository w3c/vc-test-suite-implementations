/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
import {makeRequest, zcapRequest} from './requests.js';

/**
 * Wraps settings from an implementation's json manifest
 * in an endpoint for testing with tags.
 *
 * @param {object} options - Options to use.
 * @param {object} [options.oauth2] - Oauth2 options.
 * @param {object} options.settings - Settings for the endpoint.
 */
export class Endpoint {
  constructor({oauth2, settings}) {
    this.oauth2 = oauth2;
    this.settings = settings;
  }
  // ensure tags are unique
  get tags() {
    return new Set(this.settings.tags);
  }
  post({json, headers = {}, searchParams, url}) {
    const {headers: _headers = {}, endpoint, oauth2, zcap} = this.settings;
    if(zcap) {
      return zcapRequest({
        endpoint: url || endpoint,
        zcap,
        json,
        headers
      });
    }
    return makeRequest({
      url: url || endpoint,
      method: 'POST',
      json,
      oauth2,
      searchParams,
      headers: {..._headers, ...headers}
    });
  }
  put({json, headers = {}, searchParams, url}) {
    const {headers: _headers = {}, endpoint, oauth2} = this.settings;
    return makeRequest({
      url: url || endpoint,
      method: 'PUT',
      json,
      oauth2,
      searchParams,
      headers: {..._headers, ...headers}
    });
  }
  get({headers, searchParams, url} = {}) {
    const {headers: _headers = {}, endpoint, oauth2} = this.settings;
    return makeRequest({
      method: 'GET',
      url: url || endpoint,
      oauth2,
      searchParams,
      headers: {..._headers, ...headers}
    });
  }
}

