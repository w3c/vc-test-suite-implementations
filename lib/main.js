/*
 * Copyright 2022-2024 Digital Bazaar, Inc.
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {Implementation} from './Implementation.js';
import {implementerFiles} from '../implementations/index.js';

const keyValues = implementerFiles.map(
  implementation => [implementation.name, new Implementation(implementation)]);

export {localSettings} from '../implementations/index.js';
export const implementations = new Map(keyValues);
export const allImplementations = implementations;

/**
 * Takes in a Map and a predicate and returns
 * a map with matches and a map with non-matches.
 *
 * @example filterImplementations({filter: (
 *   {value}) => value.issuers.some(i => i.tags.has('foo'))});
 *
 * @param {object} options - Options to use.
 * @param {Map} [options.implementations=allImplementations] - A Map of
 *   implementations.
 * @param {Function<boolean>} options.filter - A function to
 *   filter the map's entries on that returns true or false.
 *
 * @returns {Object<string, Map>} Returns an object with matching
 *   and non-matching maps.
 */
export const filterImplementations = ({
  implementations = allImplementations,
  filter
}) => {
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
 * Filters implementations by tags on a property in the settings.
 *
 * @example filterByTag({property: 'issuers', tags: ['ecdsa-rdfc-2019']})
 *
 * @param {object} options - Options to use.
 * @param {Map} [options.implementations=allImplementations] -
 *   Implementations to use.
 * @param {Array<string>} [options.tags=[]] - Tags to search for.
 * @param {string} [options.property='issuers'] - The property to search for on
 *   an implementation.
 *
 * @returns {Object<string, Map>} Returns an object with matching
 *   and non-matching maps.
 */
export const filterByTag = ({
  implementations = allImplementations,
  tags = [],
  property = 'issuers'
} = {}) => {
  const filter = ({value}) => {
    // if the property doesn't exist just use some on an empty array
    return (value[property] || []).some(
      endpoint => tags.some(tag => endpoint.tags.has(tag)));
  };
  return filterImplementations({implementations, filter});
};

export const endpoints = {
/**
 * Takes in a Map and a filter and returns
 * an object with match and nonMatch Maps.
 *
 * @example endpoints.filter({filter: (
 *   {value}) => value.issuers.some(i => i.tags.has('foo'))});
 *
 * @param {object} options - Options to use.
 * @param {Map} [options.implementations=allImplementations] - A Map of
 *   implementations.
 * @param {Function<boolean>} options.filter - A function to
 *  filter the map's entries that returns true or false.
 *
 * @returns {{match: Map, nonMatch: Map}} Returns an object with matching
 *   and non-matching Maps with respective endpoints.
 */
  filter({
    implementations = allImplementations,
    filter
  }) {
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
  },
  /**
 * Filters endpoints by tags on a property in the settings.
 *
 * @example endpoints.filterByTag({
 *   property: 'issuers', tags: ['ecdsa-rdfc-2019']
 * })
 *
 * @param {object} options - Options to use.
 * @param {Map} [options.implementations=allImplementations] -
 *   Implementations to use.
 * @param {Array<string>} [options.tags=[]] - Tags to search for.
 * @param {string} [options.property='issuers'] - The property to search for
 * on an implementation.
 *
 * @returns {{match: Map, nonMatch: Map}} Returns an object with matching
 *   and non-matching Maps with the endpoints matching the property and
 *   filter.
 */
  filterByTag({
    implementations = allImplementations,
    tags = [],
    property = 'issuers'
  } = {}) {
    const filter = ({implementation}) => {
      // if the property doesn't exist just use an empty array
      return (implementation[property] || []).filter(
        endpoint => tags.some(tag => endpoint.tags.has(tag)));
    };
    return endpoints.filter({implementations, filter});
  }
};
