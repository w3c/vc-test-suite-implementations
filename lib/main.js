/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
import implementorFiles from '../implementations';
import {Implementation} from './Implementation.js';

const keyValues = implementorFiles.map(
  implementation => [implementation.name, new Implementation(implementation)]);
export const implementations = new Map(keyValues);

/**
 * Takes in a Map and a predicate and returns
 * a map with matches and a map with non-matches.
 * @example filterMap({predicate: ({value}) => value.issuers.some(i => i.tags.has('foo'))});
 *
 * @param {object} options - Options to use.
 * @param {Map} options.map - A Map.
 * @param {Function<boolean>} options.predicate - A function to
 * filter the map's entries on that returns true or false.
 *
 * @returns {object.<string, Map>} Returns an object with matching
 *   and non-matching maps.
 */
export const filterMap = ({map = implementations, predicate}) => {
  const match = new Map();
  const nonMatch = new Map();
  for(const [key, value] of map) {
    const result = predicate({key, value});
    if(result === true) {
      match.set(key, value);
    } else {
      nonMatch.set(key, value);
    }
  }
  return {match, nonMatch};
};
