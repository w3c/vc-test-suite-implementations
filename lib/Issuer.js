/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
import {httpPost, zcapRequest} from './requests.js';
import {Endpoint} from './Endpoint.js';

export class Issuer extends Endpoint {
  constructor({oauth2, issuer}) {
    super({settings: issuer, oauth2});
    this.oauth2 = oauth2;
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
}
