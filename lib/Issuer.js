/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
import {httpPost, zcapRequest} from './requests.js';

export class Issuer {
  constructor({oauth2, issuer}) {
    this.oauth2 = oauth2;
    this.issuer = issuer;
  }
  // ensure tags are unique
  get tags() {
    return new Set(this.issuer.tags);
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
    const {issuer, oauth2} = this;
    const headers = {...issuer.headers};
    if(issuer.zcap) {
      return zcapRequest({
        endpoint: issuer.endpoint,
        zcap: issuer.zcap,
        json: body,
        headers
      });
    }
    return httpPost({
      endpoint: issuer.endpoint,
      oauth2,
      json: body,
      headers
    });
  }
  async setStatus({body}) {
    const {issuer, oauth2} = this;
    const headers = {...issuer.headers};
    if(issuer.zcap) {
      return zcapRequest({
        endpoint: issuer.statusEndpoint,
        zcap: issuer.zcap,
        json: body,
        headers
      });
    }
    return httpPost({
      json: body,
      oauth2,
      endpoint: issuer.statusEndpoint,
      headers
    });
  }
  async publishSlc({endpoint, body}) {
    const {issuer, oauth2} = this;
    const headers = {...issuer.headers};
    if(issuer.zcap) {
      return zcapRequest({
        endpoint,
        zcap: issuer.zcap,
        json: body,
        headers
      });
    }
    return httpPost({
      json: body,
      oauth2,
      endpoint,
      headers
    });
  }
}
