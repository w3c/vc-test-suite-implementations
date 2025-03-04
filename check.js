#!/usr/bin/env node

/*
Copyright 2025 Digital Bazaar, Inc.

SPDX-License-Identifier: BSD-3-Clause
*/

import {createRequire} from 'node:module';
import fs from 'node:fs';
import {glob} from 'glob';
import jsonld from 'jsonld';
import {JsonLdDocumentLoader} from 'jsonld-document-loader';

const require = createRequire(import.meta.url);

// Pass in `extract` to get context list instead of safe mode check results
const method = process.argv.at(2);

const jdl = new JsonLdDocumentLoader();

// collection to track all loaded contexts
const contextUrls = new Set();

jdl.addStatic(
  'https://raw.githubusercontent.com/digitalbazaar/mocha-w3c-interop-reporter/refs/heads/main/context.json',
  require('./context.json')
);

const loader = jdl.build();
jsonld.documentLoader = loader;

let failure = false;
const paths = await glob([
  `./implementations/*.json`
]);
await Promise.all(paths.map(async implementationPath => {
  const implementation = JSON.parse(
    await fs.promises.readFile(implementationPath)
  );
  // non-JSON-LD description, so skip it
  if(!('@context' in implementation)) {
    return;
  }
  try {
    await jsonld.expand(implementation, {safe: true});
    if(method !== 'extract') {
      console.log('👍 All terms correctly defined in', implementationPath);
    }
  } catch(err) {
    if(method !== 'extract') {
      console.log('😢 Errors found in', implementationPath);
    }
    console.dir(err, {depth: 5});
    failure = true;
  }
}));

if(failure) {
  process.exit(1);
}

if(method === 'extract') {
  console.log(JSON.stringify([...contextUrls].sort(), null, 2));
}
