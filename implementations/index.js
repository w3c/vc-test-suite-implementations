/*
 * Copyright 2022-2024 Digital Bazaar, Inc.
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

import appRoot from 'app-root-path';
import {createRequire} from 'node:module';
import {join} from 'node:path';

const require = createRequire(import.meta.url);
const requireDir = require('require-dir');
// get all the remote implementations in this dir
const remote = Object.values(requireDir('./'));

// gets local manifests from an optional config file
const getLocalManifest = fileName => {
  try {
    const path = join(
      appRoot.toString(), fileName);
    return require(path);
  } catch(e) {
    if(e?.code === 'MODULE_NOT_FOUND') {
      return {};
    }
    throw e;
  }
};

const localConfig = getLocalManifest('localConfig.cjs');
export const localSettings = (Object.keys(localConfig).length > 0) ?
  // if there is a localConfig.settings overwrite local defaults
  {...{enableInteropTests: false, testAllImplementations: false},
    ...localConfig?.settings} :
  // otherwise, return the global defaults
  // FIXME: ...consider renaming `localSettings` as it can hold global ones...
  {enableInteropTests: true, testAllImplementations: true};

// get localConfig and look for an implementations property
let local = localConfig?.implementations || [];
// it's an easy typo to set `implementations` to an object...instead of an array
if(!Array.isArray(local)) {
  local = [local];
}
// concat all the implementation manifests together
const all = remote.concat(local);

// if local implementations are defined only return local implementations
export const implementerFiles = local.length ?
  // unless testAllImplementations is true...in which case, include them all
  (localSettings.testAllImplementations === true ? all : local) :
  all;
