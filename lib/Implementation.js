/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';
import {Issuer} from './Issuer.js';
import {Verifier} from './Verifier.js';
import {DidResolver} from './DidResolver.js';
import {Endpoint} from './Endpoint.js';

export class Implementation {
  constructor(settings) {
    this.settings = settings;
    const {oauth2} = settings;
    const skip = ['issuers', 'verifiers', 'oauth2', 'didResolvers'];
    for(const key in settings) {
      if(skip.includes(key)) {
        continue;
      }
      // create a getter for each endpoint in the manifest
      // not already covered by an existing class
      Object.defineProperty(this, key, {get: () => {
        console.log({key});
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
  get verifiers() {
    return this.settings.verifiers.map(verifier => new Verifier({
      verifier,
      oauth2: this.settings.oauth2
    }));
  }
  get didResolvers() {
    const didResolvers = this.settings.didResolvers || [];
    return didResolvers.map(didResolver => new DidResolver({
      didResolver,
      oauth2: this.settings.oauth2
    }));
  }
}
