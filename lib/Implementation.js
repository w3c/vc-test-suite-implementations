/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const https = require('https');
const {httpClient} = require('@digitalbazaar/http-client');
const {ISOTimeStamp} = require('./helpers');
const {v4: uuidv4} = require('uuid');
const didKey = require('@digitalbazaar/did-method-key');
const {decodeSecretKeySeed} = require('bnid');
const {ZcapClient} = require('@digitalbazaar/ezcap');
const didKeyDriver = didKey.driver();
const {Ed25519Signature2020} = require('@digitalbazaar/ed25519-signature-2020');
const {createRootCapability} = require('@digitalbazaar/zcap');

const agent = new https.Agent({rejectUnauthorized: false});

const _headers = {
  Accept: 'application/ld+json,application/json',
  'Content-Type': 'application/json',
};

class Implementation {
  constructor(settings) {
    this.settings = settings;
  }
  async issue({credential}) {
    try {
      const expires = () => {
        const date = new Date();
        date.setMonth(date.getMonth() + 2);
        return ISOTimeStamp({date});
      };
      const body = {
        credential: {
          ...credential,
          id: `urn:uuid:${uuidv4()}`,
          issuanceDate: ISOTimeStamp(),
          expirationDate: expires(),
          issuer: this.settings.issuer.id,
          '@context': credential['@context']
        }
      };
      const headers = {
        ..._headers,
        ...this.settings.issuer.headers
      };
      let result;
      if(this.settings.issuer.zcap) {
        const zcapClient = await _getZcapClient();
        result = await zcapClient.write({
          url: this.settings.issuer.endpoint,
          capability: JSON.parse(this.settings.issuer.zcap),
          json: body
        });
      } else {
        result = await httpClient.post(
          this.settings.issuer.endpoint,
          {headers, agent, json: body}
        );
      }
      return result;
    } catch(e) {
      // this is just to make debugging easier
      console.error(e);
      throw e;
    }
  }
  async setStatus(body) {
    const headers = {
      ..._headers,
      ...this.settings.issuer.headers
    };
    try {
      let result;
      if(this.settings.issuer.zcap) {
        const zcapClient = await _getZcapClient();
        result = await zcapClient.write({
          url: this.settings.issuer.statusEndpoint,
          capability: JSON.parse(this.settings.issuer.zcap),
          json: body
        });
      } else {
        result = await httpClient.post(
          this.settings.issuer.statusEndpoint,
          {headers, agent, json: body});
      }
      return result;
    } catch(e) {
      console.log(e);
      throw e;
    }
  }
  async verify({credential, auth}) {
    try {
      const body = {
        verifiableCredential: credential,
        options: {
          checks: ['proof', 'credentialStatus'],
        },
      };
      const headers = {
        ..._headers,
        ...this.settings.issuer.headers
      };
      if(auth && auth.type === 'oauth2-bearer-token') {
        headers.Authorization = `Bearer ${auth.accessToken}`;
      }
      let result;
      if(this.settings.verifier.zcap) {
        const zcapClient = await _getZcapClient();
        result = await zcapClient.write({
          url: this.settings.verifier.endpoint,
          capability: JSON.parse(this.settings.verifier.zcap),
          json: body
        });
      } else {
        result = await httpClient.post(
          this.settings.verifier.endpoint,
          {headers, agent, json: body}
        );
      }
      return result;
    } catch(e) {
      // this is just to make debugging easier
      if(e && e.response && e.response.data) {
        throw new Error(JSON.stringify(e.response.data, null, 2));
      }
      throw e;
    }
  }
}

async function _getZcapClient() {
  const secretKeySeed = process.env.CLIENT_SECRET;
  const seed = await decodeSecretKeySeed({secretKeySeed});
  const didKey = await didKeyDriver.generate({seed});
  const {didDocument: {capabilityInvocation}} = didKey;
  const zcapClient = new ZcapClient({
    SuiteClass: Ed25519Signature2020,
    invocationSigner: didKey.keyPairs.get(capabilityInvocation[0]).signer(),
    agent
  });
  return zcapClient;
}

module.exports = Implementation;
