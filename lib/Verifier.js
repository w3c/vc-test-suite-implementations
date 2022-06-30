/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

import {Endpoint} from './Endpoint.js';

export class Verifier extends Endpoint {
  constructor({verifier, oauth2}) {
    super({settings: verifier, oauth2});
    this.verifier = verifier;
    this.oauth2 = oauth2;
  }
  async verify({body}) {
    return this.post({json: body});
  }
}
