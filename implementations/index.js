/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
import appRoot from 'app-root-path';
import {createRequire} from 'node:module';
import {join} from 'node:path';

const require = createRequire(import.meta.url);
const requireDir = require('require-dir');

// get all the json files in this dir
const manifests = Object.values(requireDir('./'));

// gets local implementations from an optional config file
const getLocalImplementations = fileName => {
  try {
    const path = join(
      appRoot.toString(), fileName);
    return require(path);
  } catch(e) {
    if(e?.code === 'MODULE_NOT_FOUND') {
      return [];
    }
    throw e;
  }
};

// open either list of local endpoints and merge into one list of endpoints.
const localImplementations = [
  getLocalImplementations('.localImplementationsConfig.cjs'),
  getLocalImplementations('localImplementationsConfig.cjs')
].flatMap(a => a);

// look for local only in a local settings file
const localOnly = localImplementations.some(i => i?.local === true);

export const implementerFiles = localOnly ? localImplementations :
  manifests.concat(localImplementations);
