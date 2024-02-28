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

// concat all the manifests together
const allManifests = manifests.concat(localImplementations);

// look for only in a manifest
const hasOnly = allManifests.filter(i => i?.only === true);

// if any manifest has only true only return the hasOnly
// otherwise return all the manifests
export const implementerFiles = hasOnly.length ? hasOnly : allManifests;
