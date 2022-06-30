/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
import {makeRequest} from './requests.js';

export class Endpoint {
  constructor({oauth2, settings}) {
    this.oauth2 = oauth2;
    this.settings = settings;
  }
  // ensure tags are unique
  get tags() {
    return new Set(this.settings.tags);
  }
  post({json, headers = {}, searchParams}) {
    const {headers: _headers = {}, endpoint, oauth2} = this.settings;
    return makeRequest({
      url: endpoint,
      method: 'POST',
      json,
      oauth2,
      searchParams,
      headers: {..._headers, ...headers}
    });
  }
  put({json, headers = {}, searchParams}) {
    const {headers: _headers = {}, endpoint, oauth2} = this.settings;
    return makeRequest({
      url: endpoint,
      method: 'PUT',
      json,
      oauth2,
      searchParams,
      headers: {..._headers, ...headers}
    });
  }
  get({headers, searchParams} = {}) {
    const {headers: _headers = {}, endpoint, oauth2} = this.settings;
    return makeRequest({
      method: 'GET',
      url: endpoint,
      oauth2,
      searchParams,
      headers: {..._headers, ...headers}
    });
  }
}

