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

// get localConfig and look for an implementations property
const local = manifests.local = getLocalManifest('localConfig.cjs')?.
  implementations || [];

// concat all the implementation manifests together
const all = manifests.all = manifests.remote.concat(manifests.local);

// look for only in a local manifests
const only = manifests.only = manifests.local.filter(i => i?.only === true);

// if local implementations are defined only return local implementations
export const implementerFiles = local.length ? only : all;
