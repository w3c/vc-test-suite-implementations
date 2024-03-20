/*
 * Copyright 2022-2024 Digital Bazaar, Inc.
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {Endpoint} from './Endpoint.js';

export class Implementation {
  constructor(settings) {
    this.settings = settings;
    const {oauth2} = settings;
    // these are properties we don't want to cast to
    // Endpoints
    const skip = ['oauth2'];
    for(const key in settings) {
      if(skip.includes(key)) {
        continue;
      }
      const settingProperty = settings[key];
      if(!Array.isArray(settingProperty)) {
        continue;
      }
      // create a getter for each endpoint in the manifest
      Object.defineProperty(this, key, {get: () => {
        return settingProperty.map(setting => new Endpoint({
          settings: setting,
          oauth2
        }));
      }});
    }
  }
}
