/*
 * Copyright 2022-2024 Digital Bazaar, Inc.
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

import chai from 'chai';
const should = chai.should();

import {allImplementations} from '../lib/main.js';

describe('Loading implementations', () => {
  it('should result in no errors.', async () => {
    should.exist(allImplementations);
  });
});
