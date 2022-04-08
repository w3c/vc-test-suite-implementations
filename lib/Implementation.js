/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';
import {Issuer} from './Issuer.js';
import {Verifier} from './Verifier.js';

export class Implementation {
  constructor(settings) {
    this.settings = settings;
  }
  get issuers() {
    return new Set(this.settings.issuers.map(issuer => new Issuer({
      issuer,
      oath2: this.settings.oath2
    })));
  }
  get verifiers() {
    return new Set(this.settings.verifiers.map(verifier => new Verifier({
      verifier,
      oath2: this.settings.oath2
    })));
  }
}
