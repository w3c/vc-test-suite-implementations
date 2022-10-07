/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
import {makeHttpsRequest, zcapRequest} from './requests.js';

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
    this.settings = {...settings};
    if(oauth2) {
      // add global oauth2 settings to endpoint settings
      this.settings.oauth2 = {...oauth2};
      // scopes are endpoint specific so we need to add them
      // to the global oauth credentials
      if(Array.isArray(this.settings.scopes)) {
        this.settings.oauth2.scopes = [...this.settings.scopes];
      }
    }
  }
  // ensure tags are unique
  get tags() {
    return new Set(this.settings.tags);
  }
  post({headers = {}, url, ...args}) {
    const {headers: _headers = {}, endpoint, oauth2, zcap} = this.settings;
    if(zcap) {
      return zcapRequest({
        endpoint: url || endpoint,
        zcap,
        headers: {..._headers, ...headers},
        ...args
      });
    }
    return makeHttpsRequest({
      url: url || endpoint,
      method: 'POST',
      oauth2,
      headers: {..._headers, ...headers},
      ...args
    });
  }
  put({headers = {}, url, ...args}) {
    const {headers: _headers = {}, endpoint, oauth2} = this.settings;
    return makeHttpsRequest({
      url: url || endpoint,
      method: 'PUT',
      oauth2,
      headers: {..._headers, ...headers},
      ...args
    });
  }
  get({headers, url, ...args} = {}) {
    const {headers: _headers = {}, endpoint, oauth2} = this.settings;
    return makeHttpsRequest({
      method: 'GET',
      url: url || endpoint,
      oauth2,
      headers: {..._headers, ...headers},
      ...args
    });
  }
}
