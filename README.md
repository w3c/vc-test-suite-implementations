<!--
Copyright 2024 Digital Bazaar, Inc.

SPDX-License-Identifier: BSD-3-Clause
-->

# VC Test Suite Implementations

This repository contains a list of all implementations that have registered to
be regularly run against the
[W3C Verifiable Credentials](https://www.w3.org/groups/wg/vc/) test suites.

## Table of Contents

- [Background](#background)
- [Security](#security)
- [Install](#install)
  - [NPM](#npm)
  - [Development](#development)
- [Usage](#usage)
  - [Adding a new implementation](#adding-a-new-implementation)
  - [Testing locally](#testing-locally)
  - [Using only](#using-only)
  - [Tags](#tags)
- [Contribute](#contribute)
- [License](#license)

## Background

Implementations added to this package are tested against various test suites
listed below in order to demonstrate [W3C Verifiable Credentials](https://www.w3.org/groups/wg/vc/) interoperability.

## Security

Please do not commit any sensitive materials such as oauth2 client secrets or
private key information used for signing
[Authorization Capabilities](https://w3c-ccg.github.io/zcap-spec/) or
[HTTP Message Signatures](https://www.ietf.org/archive/id/draft-ietf-httpbis-message-signatures-08.html).

## Install

- Node.js 18+ is required.

### NPM

To install via NPM:
```sh
npm install w3c/vc-test-suite-implementations
```

### Development

To install locally (for development):

```sh
git clone https://github.com/w3c/vc-test-suite-implementations.git
cd vc-test-suite-implementations
npm install
```

## Usage

#### Adding a new implementation
Please add implementations to the `./implementations` directory.
Implementation configuration files are expressed in JSON and use roughly the
following form:

```json
{
  "name": "My Company",
  "implementation": "My Implementation Name",
  "oauth2": {
     "clientId": "bar",
     "clientSecret": "CLIENT_SECRET_MY_COMPANY",
     "tokenAudience": "https://product.example.com",
     "tokenEndpoint": "https://product.example.com/oauth/token"
  },
  "issuers": [{
    "id": "urn:uuid:my:implementation:issuer:id",
    "endpoint": "https://product.example.com/issuers/foo/credentials/issue",
    "zcap": {
      "capability": "{\"@context\":[\"https://w3id.org/zcap/v1\",\"https://w3id.org/security/suites/ed25519-2020/v1\"],\"id\":\"urn:uuid:4d44084c-334e-46dc-ac23-5e26f75262b6\",\"controller\":\"did:key:zFoo\",\"parentCapability\":\"urn:zcap:root:https%3A%2F%2Fmy.implementation.net%2Fissuers%2Fz19wCeJafpsTzvA6hZksz7TYF\",\"invocationTarget\":\"https://my.implementation.net/issuers/z19wCeJafpsTzvA6hZksz7TYF/credentials/issue\",\"expires\":\"2022-05-29T17:26:30Z\",\"proof\":{\"type\":\"Ed25519Signature2020\",\"created\":\"2022-02-28T17:26:30Z\",\"verificationMethod\":\"did:key:z6Mkk2x1J4jCmaHDyYRRW1NB7CzeKYbjo3boGfRiefPzZjLQ#z6Mkk2x1J4jCmaHDyYRRW1NB7CzeKYbjo3boGfRiefPzZjLQ\",\"proofPurpose\":\"capabilityDelegation\",\"capabilityChain\":[\"urn:zcap:root:https%3A%2F%2Fmy.implementation.net%2Fissuers%2Fz19wCeJafpsTzvA6hZksz7TYF\"],\"proofValue\":\"zBar\"}}",
      "keySeed": "KEY_SEED_DB"
    },
    "supportedEcdsaKeyTypes": ["P-256"]
    "tags": ["ecdsa-rdfc-2019"]
  }],
  "verifiers": [{
    "id": "https://product.example.com/verifiers/z19uokPn3b1Z4XDbQSHo7VhFR",
    "endpoint": "https://product.example.com/verifiers/z19uokPn3b1Z4XDbQSHo7VhFR/credentials/verify",
    "zcap": {
      "capability": "{\"@context\":[\"https://w3id.org/zcap/v1\",\"https://w3id.org/security/suites/ed25519-2020/v1\"],\"id\":\"urn:uuid:41473f9f-9e44-4ac9-9ac2-c86a6f695703\",\"controller\":\"did:key:zFoo\",\"parentCapability\":\"urn:zcap:root:https%3A%2F%2Fmy.implementation.net%3A40443%2Fverifiers%2Fz19uokPn3b1Z4XDbQSHo7VhFR\",\"invocationTarget\":\"https://my.implementation.net/verifiers/zBar/credentials/verify\",\"expires\":\"2023-03-17T17:39:49Z\",\"proof\":{\"type\":\"Ed25519Signature2020\",\"created\":\"2022-03-17T17:39:49Z\",\"verificationMethod\":\"did:key:zFoo#zBar\",\"proofPurpose\":\"capabilityDelegation\",\"capabilityChain\":[\"urn:zcap:root:https%3A%2F%2Fmy.application.net%2Fverifiers%2FzFoo\"],\"proofValue\":\"zBar\"}}",
      "keySeed": "KEY_SEED_DB"
    },
    "supportedEcdsaKeyTypes": ["P-256"]
    "tags": ["ecdsa-rdfc-2019"]
  }]
}
```

Please note: implementations may specify authorization parameters for oauth2 or
zcaps, but not both. Implementations may also not specify any authorization
parameters, in which case they do not specify `oauth2` or `zcap` properties.

#### Testing locally

To test implementations with endpoints running locally, create a configuration file named
either `.localImplementationsConfig.cjs` or `localImplementationsConfig.cjs` in the root
directory of the test suite.

This file must be a CommonJS module that exports an array of implementations:

```js
// .localImplementationsConfig.cjs defining local implementations
module.exports = [{
  "name": "My Company",
  "implementation": "My Implementation Name",
  "issuers": [{
    "id": "urn:uuid:my:implementation:issuer:id",
    "endpoint": "https://localhost:40443/issuers/foo/credentials/issue",
    "tags": ["eddsa-rdfc-2022", "localhost"]
  }],
  "verifiers": [{
    "id": "https://localhost:40443/verifiers/z19uokPn3b1Z4XDbQSHo7VhFR",
    "endpoint": "https://localhost:40443/verifiers/z19uokPn3b1Z4XDbQSHo7VhFR/credentials/verify",
    "tags": ["eddsa-rdfc-2022", "localhost"]
  }]
}];
```

After adding the config file, both the localhost implementations and other
non-localhost implementations will be included in the test run. To just run implementations
from the local config file see the [Using only](#using-only) section below.

### Using only
Local Implementations marked `only` will be the only implementations used in a test run.
For example, to only run a single implementation in a suite set `only: true` in
the local implementation manifest.

```js
module.exports = [{
  "name": "My Company",
  "implementation": "My Implementation Name",
  // this will ensure only this implementation is used in a suite
  "only": true,
  "issuers": [{
    "id": "urn:uuid:my:implementation:issuer:id",
    "endpoint": "https://localhost:40443/issuers/foo/credentials/issue",
    "tags": ["eddsa-rdfc-2022", "localhost"]
  }],
  "verifiers": [{
    "id": "https://localhost:40443/verifiers/z19uokPn3b1Z4XDbQSHo7VhFR",
    "endpoint": "https://localhost:40443/verifiers/z19uokPn3b1Z4XDbQSHo7VhFR/credentials/verify",
    "tags": ["eddsa-rdfc-2022", "localhost"]
  }]
}];
```

### Tags

Tags tell the test suites which implementations to run the test suites against.

* `vc2.0` - This tag will run the [VC Data Model 2.0 Test Suite](https://github.com/w3c/vc-data-model-2.0-test-suite) on your issuer and verifier endpoints.

* `Ed25519Signature2020` - This tag will run the [Ed25519 tests](https://github.com/w3c/vc-di-ed25519signature2020-test-suite) on either your issuer and/or verifier.

* `ecdsa-rdfc-2019` or `ecdsa-sd-2023` - These tags will run the
[VC Data Integrity ECDSA Test Suite](https://github.com/w3c/vc-di-ecdsa-test-suite)
on your issuer and verifier endpoints.
  * Alongside this cryptosuite tag, you must also specify the
  `supportedEcdsaKeyTypes` property listing the ECDSA key types that your
  implementation issues or can verify. Currently, the test suite supports
  `P-256` and `P-384` ECDSA key types.

  You can specify the key types supported by your implementation in the issuer
  and verifier configs as shown in this example:
  ```json
  {
    "issuers": [{
      ...
      "supportedEcdsaKeyTypes": ["P-256", "P-384"]
      "tags": ["ecdsa-rdfc-2019"]
    }, {
      ...
      "supportedEcdsaKeyTypes": ["P-256", "P-384"]
      "tags": ["ecdsa-jcs-2019"]
    }, {
      ...
      "supportedEcdsaKeyTypes": ["P-256"]
      "tags": ["ecdsa-sd-2023"]
    }],
    "verifiers": [{
      ...
      "supportedEcdsaKeyTypes": ["P-256", "P-384"]
      "tags": ["ecdsa-rdfc-2019"]
    }, {
      ...
      "supportedEcdsaKeyTypes": ["P-256", "P-384"]
      "tags": ["ecdsa-jcs-2019"]
    }, {
      ...
      "supportedEcdsaKeyTypes": ["P-256"]
      "tags": ["ecdsa-sd-2023"]
    }]
  }
  ```

* `eddsa-rdfc-2022` - This tag will run the [VC Data Integrity EDDSA Test Suite](https://github.com/w3c/vc-di-eddsa-test-suite) on your issuer and verifier endpoints.

## Contribute

See [the CONTRIBUTING.md file](CONTRIBUTING.md).

Pull Requests are welcome!

## License

[BSD-3-Clause](LICENSE) Copyright 2022-2024, World Wide Web Consortium
