/*
 * Copyright 2022-2024 Digital Bazaar, Inc.
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as didKey from '@digitalbazaar/did-method-key';
import https from 'https';

export const agent = new https.Agent({rejectUnauthorized: false});

export const headers = {
  Accept: 'application/ld+json,application/json',
  'Content-Type': 'application/json',
};

export const didKeyDriver = didKey.driver();

export const defaultHeaders = {
  Accept: 'application/json, application/ld+json, */*'
};

export const postHeaders = {
  'Content-Type': 'application/json',
  ...defaultHeaders
};

export const sanitizeHeaders = ['Authorization'];
