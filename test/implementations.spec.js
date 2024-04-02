/*
 * Copyright 2022-2024 Digital Bazaar, Inc.
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

import chai from 'chai';
const should = chai.should();

import {allImplementations} from '../lib/main.js';

describe('Loading implementations', () => {
  it('result in no errors.', async () => {
    should.exist(allImplementations);
  });

  describe('Implementations using DID:key identifiers', () => {
    allImplementations.forEach(implementation => {
      const {issuers, verifiers} = implementation;

      const isDidKeyFilter = ({settings: {id}}) =>
        id && id.startsWith('did:key');

      describe(implementation.settings.name, () => {
        issuers.filter(isDidKeyFilter)
          .map(({settings: {id}}, index) => {
            describe(`issuer[${index}].id`, () => {
              it('should not specify a fragment', () => {
                chai.expect(id).not.match(/#/);
              });
            });
          });

        verifiers.filter(isDidKeyFilter)
          .map(({settings: {id}}, index) => {
            describe(`verifier[${index}].id`, () => {
              it('should not specify a fragment', () => {
                chai.expect(id).not.match(/#/);
              });
            });
          });
      });
    });
  });
});
