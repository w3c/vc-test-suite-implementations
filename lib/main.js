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
 *
 * @example filterImplementations({predicate: (
 *   {value}) => value.issuers.some(i => i.tags.has('foo'))});
 *
 * @param {object} options - Options to use.
 * @param {Map} options.map - A Map.
 * @param {Function<boolean>} options.predicate - A function to
 * filter the map's entries on that returns true or false.
 *
 * @returns {object.<string, Map>} Returns an object with matching
 *   and non-matching maps.
 */
export const filterImplementations = ({map = implementations, predicate}) => {
  const match = new Map();
  const nonMatch = new Map();
  for(const [key, value] of implementations) {
    const result = filter({key, value});
    if(result === true) {
      match.set(key, value);
    } else {
      nonMatch.set(key, value);
    }
  }
  return {match, nonMatch};
};

/**
 * Filters implementations by tags on issuers and verifiers.
 *
 * @example filterByTag({issuerTags: ['VC-HTTP-API']})
 *
 * @param {object} options - Options to use.
 * @param {Map} [options.map=implementations] - Implementations to use.
 * @param {Array<string>} [options.issuerTags=[]] - Tags for issuers.
 * @param {Array<string>} [options.verifierTags=[]] - Tags for verifiers.
 *
 * @returns {object.<string, Map>} Returns an object with matching
 *   and non-matching maps.
 */
export const filterByTag = ({
  map = implementations,
  issuerTags = [],
  verifierTags = []
} = {}) => {
  const predicate = ({value}) => {
    return value.issuers.some(i => issuerTags.some(tag => i.tags.has(tag))) ||
      value.verifiers.some(v => verifierTags.some(tag => v.tags.has(tag)));
  };
  return filterImplementations({map, predicate});
};
