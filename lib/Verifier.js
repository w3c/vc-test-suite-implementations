/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

import {httpPost, zcapRequest} from './requests.js';
import {Endpoint} from './Endpoint.js';

export class Verifier extends Endpoint {
  constructor({verifier, oauth2}) {
    super({settings: verifier, oauth2});
    this.verifier = verifier;
    this.oauth2 = oauth2;
  }
  async verify({body}) {
    const {verifier, oauth2} = this;
    const headers = {
      ...verifier.headers
    };
    if(verifier.zcap) {
      return zcapRequest({
        endpoint: verifier.endpoint,
        zcap: verifier.zcap,
        json: body,
        headers
      });
    }
    return httpPost({
      json: body,
      oauth2,
      endpoint: verifier.endpoint,
      headers
    });
  }
}
