/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

import {httpRequest, zcapRequest} from './requests.js';

export class Verifier {
  constructor({verifier, oath2}) {
    this.verifier = verifier;
    this.oauth2 = oath2;
  }
  async verify({body}) {
    const {verifier, oath2} = this;
    const headers = {
      ...verifier.headers
    };
    if(verifier.zcap) {
      return zcapRequest({
        endpoint: verifier.endpoint,
        zcap: verifier.zcap,
        json: body
      });
    }
    return httpRequest({
      json: body,
      oath2,
      endpoint: verifier.endpoint,
      headers
    });
  }
}
