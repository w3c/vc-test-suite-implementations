/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
import {httpGet} from './requests.js';

export class DidResolver {
  constructor({didResolver, oauth2}) {
    this.didResolver = didResolver;
    this.oauth2 = oauth2;
  }
  // ensure tags are unique
  get tags() {
    return new Set(this.didResolver.tags);
  }
  async resolve({did}) {
    const {didResolver, oauth2} = this;
    const url = `${didResolver.endpoint}/${encodeURIComponent(did)}`;
    const headers = {
      Accept: 'application/ld+json;profile="https://w3id.org/did-resolution"'
    };
    return httpGet({url, oauth2, headers});
  }
}
