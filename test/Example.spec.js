/*!
 * Copyright (c) 2021 Digital Bazaar, Inc. All rights reserved.
 */
import chai from 'chai';
chai.should();
const {expect} = chai;

import {Example} from '..';

describe('Example', () => {
  describe('constructor', () => {
    it('should exist', async () => {
      const ex = new Example();

      expect(ex).to.exist;
    });
  });
});
