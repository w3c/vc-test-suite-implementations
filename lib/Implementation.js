/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';
import {Issuer} from './Issuer.js';
import {Endpoint} from './Endpoint.js';

export class Implementation {
  constructor(settings) {
    this.settings = settings;
    const {oauth2} = settings;
    // these are properties we don't want to cast to
    // Endpoints
    const skip = ['issuers', 'oauth2'];
    for(const key in settings) {
      if(skip.includes(key)) {
        continue;
      }
      // create a getter for each endpoint in the manifest
      // not already covered by an existing class
      Object.defineProperty(this, key, {get: () => {
        return settings[key].map(setting => new Endpoint({
          settings: setting,
          oauth2
        }));
      }});
    }
  }
  get issuers() {
    return this.settings.issuers.map(issuer => new Issuer({
      issuer,
      oauth2: this.settings.oauth2
    }));
  }
}
