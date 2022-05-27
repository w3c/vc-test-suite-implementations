/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
import chai from 'chai';
const should = chai.should();

import {implementations} from '../main.js';

describe('implementations', () => {
  it('should exist', async () => {
    should.exist(implementations);
  });
});
