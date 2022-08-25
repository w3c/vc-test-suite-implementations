/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
import {Implementation} from './Implementation.js';
import {implementerFiles} from '../implementations/index.js';
export {Endpoint} from './Endpoint.js';

const keyValues = implementerFiles.map(
  implementation => [implementation.name, new Implementation(implementation)]);

export const implementations = new Map(keyValues);
export const allImplementations = implementations;

/**
 * Takes in a Map and a filter and returns
 * an object with match and nonMatch Maps.
 *
 * @example filterImplementations({filter: (
 *   {value}) => value.issuers.some(i => i.tags.has('foo'))});
 *
 * @param {object} options - Options to use.
 * @param {Map} [options.implementations=allImplementations] - A Map of
 *   implementations.
 * @param {Function<boolean>} options.filter - A function to
 * filter the map's entries that returns true or false.
 *
 * @returns {{match: Map, nonMatch: Map}} Returns an object with matching
 *   and non-matching Maps with respective endpoints.
 */
export const filterImplementations = ({
  implementations = allImplementations,
  filter
}) => {
  const match = new Map();
  const nonMatch = new Map();
  for(const [implementationName, implementation] of implementations) {
    const endpoints = filter({name: implementationName, implementation});
    if(endpoints.length > 0) {
      match.set(implementationName, {endpoints, implementation});
    } else {
      nonMatch.set(implementationName, {endpoints, implementation});
    }
  }
  return {match, nonMatch};
};

/**
 * Filters implementations by tags on a property in the settings.
 *
 * @example filterByTag({property: 'issuers', tags: ['VC-HTTP-API']})
 *
 * @param {object} options - Options to use.
 * @param {Map} [options.implementations=allImplementations] -
 *   Implementations to use.
 * @param {Array<string>} [options.tags=[]] - Tags to search for.
 * @param {string} [options.property='issuers'] - The property to search for on
 *   an implementation.
 *
 * @returns {{match: Map, nonMatch: Map}} Returns an object with matching
 *   and non-matching Maps with the endpoints matching the property and filter.
 */
export const filterByTag = ({
  implementations = allImplementations,
  tags = [],
  property = 'issuers'
} = {}) => {
  const filter = ({implementation}) => {
    // if the property doesn't exist just use an empty array
    return (implementation[property] || []).filter(
      endpoint => tags.some(tag => endpoint.tags.has(tag)));
  };
  return filterImplementations(implementations, filter);
};
