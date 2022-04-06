/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
import * as implementorFiles from '../implementations';
import Implementation from './Implementation';

const keyValues = implementorFiles.map(implementation => [implementation.name, new Implementation(implementation)]);
export const implementations = new Map(keyValues);
export default implementations;

