/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
import {Endpoint} from './Endpoint.js';

export class DidResolver extends Endpoint {
  constructor({didResolver, oauth2}) {
    super({settings: didResolver, oauth2});
    this.didResolver = didResolver;
    this.oauth2 = oauth2;
  }
  async resolve({did}) {
    const {didResolver, oauth2} = this;
    const url = `${didResolver.endpoint}/${encodeURIComponent(did)}`;
    const headers = {
      Accept: 'application/ld+json;profile="https://w3id.org/did-resolution"'
    };
    return this.get({url, oauth2, headers});
  }
}
