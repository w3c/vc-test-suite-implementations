/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
import implementorFiles from '../implementations';
import {Implementation} from './Implementation.js';

const keyValues = implementorFiles.map(
  implementation => [implementation.name, new Implementation(implementation)]);
export const implementations = new Map(keyValues);
