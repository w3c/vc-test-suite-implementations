/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
import appRoot from 'app-root-path';
import {createRequire} from 'node:module';
import {join} from 'node:path';

const require = createRequire(import.meta.url);
const requireDir = require('require-dir');
const manifests = {};
// get all the remote implementations in this dir
manifests.remote = Object.values(requireDir('./'));

// gets local manifests from an optional config file
const getLocalManifest = fileName => {
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

// get all local endpoints dot file or otherwise
manifests.local = [
  '.localImplementationsConfig.cjs',
  'localImplementationsConfig.cjs'
].flatMap(path => getLocalManifest(path));

// concat all the implementation manifests together
const all = manifests.all = manifests.remote.concat(manifests.local);

// look for only in a local manifests
const only = manifests.only = manifests.local.filter(i => i?.only === true);

export const implementerFiles = only.length ? only : all;
