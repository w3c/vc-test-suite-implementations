/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';
//import {Issuer} from './Issuer.js';
import {Verifier} from './Verifier.js';

export class Implementation {
  constructor(settings) {
    this.settings = settings;
  }
  get issuers() {
    return new Set(this.settings.issuers);
  }
  get verifiers() {
    return new Set(this.settings.verifiers);
  }
}
