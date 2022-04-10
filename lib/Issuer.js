/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
import {httpRequest, zcapRequest} from './requests.js';

export class Issuer {
  constructor({oath2, issuer}) {
    this.oath2 = oath2;
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
    const {issuer, oath2} = this;
    const headers = {...issuer.headers};
    if(issuer.zcap) {
      return zcapRequest({
        endpoint: issuer.endpoint,
        zcap: issuer.zcap,
        json: body
      });
    }
    return httpRequest({
      endpoint: issuer.endpoint,
      oath2,
      json: body,
      headers
    });
  }
  async setStatus({body}) {
    const {issuer, oath2} = this;
    const headers = {...issuer.headers};
    if(issuer.zcap) {
      return zcapRequest({
        endpoint: issuer.statusEndpoint,
        zcap: this.settings.zcap,
        json: body
      });
    }
    return httpRequest({
      json: body,
      oath2,
      endpoint: issuer.statusEndpoint,
      headers
    });
  }
}
