/*
 * Copyright 2022-2024 Digital Bazaar, Inc.
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

import chai from 'chai';
import chaiDateTime from 'chai-datetime';
const should = chai.should();
chai.use(chaiDateTime);

// from https://github.com/mochajs/mocha/issues/1480#issuecomment-487074628
it.allowFail = (title, callback) => {
  it(title, function() {
    return Promise.resolve().then(() => {
      return callback.apply(this, arguments);
    }).catch(() => {
      this.skip();
    });
  });
};

import {allImplementations, rawImplementations} from '../lib/main.js';

describe('Loading implementations', () => {
  it('should result in no errors.', async () => {
    should.exist(allImplementations);
  });

  describe('Implementations using DID:key identifiers', () => {
    allImplementations.forEach(implementation => {
      const {issuers, verifiers} = implementation;

      const isDidKeyFilter = ({settings: {id}}) =>
        id && id.startsWith('did:key');

      describe(implementation.settings.name, () => {
        issuers?.filter(isDidKeyFilter)
          .map(({settings: {id}}, index) => {
            describe(`issuer[${index}].id`, () => {
              it('should not specify a fragment', () => {
                chai.expect(id).not.match(/#/);
              });
            });
          });

        verifiers?.filter(isDidKeyFilter)
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

  describe('Implementations using ZCAPs', () => {
    rawImplementations.forEach(implementation => {
      Object.keys(implementation)
        .filter(key => Array.isArray(implementation[key]))
        .forEach(implementationType => {
          describe(`${implementation.name} - ${implementationType}`, () => {
            implementation[implementationType]
              ?.filter(({zcap}) => zcap?.capability)
              .forEach(config => {
                it.allowFail(`ZCAP should not be expired for ${config.id}`,
                  () => {
                    const expiration = JSON.parse(config.zcap.capability)
                      .expires;
                    const today = new Date();
                    const nextMonth = new Date(
                      today.getFullYear(), today.getMonth() + 1,
                      today.getDate());
                    chai.expect(new Date(expiration)).to.be
                      .afterDate(nextMonth);
                  }
                );

                it(`The "endpoint" MUST match the "invocationTarget" in the
                    ZCAP for ${config.id}`, () => {
                  const invocationTarget = JSON.parse(
                    config.zcap.capability).invocationTarget;
                  chai.expect(config.endpoint).to.equal(invocationTarget);
                });
              });
          });
        });
    });
  });
});
