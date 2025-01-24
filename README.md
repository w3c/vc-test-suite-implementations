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

Please check specific test suite READMEs for further details on implementation properties and endpoints. 
Test suites MAY specify additional properties and features for endpoints such as
mandatory JSON-LD contexts, keyTypes settings, additional tags for specific tests such as Enveloped Proofs,
and supported VC Data Model versions. In most cases, endpoints are expected to: be capable
of using the test suite API; be capable of signing and/or verifying using `did:key`; and support the following contexts:

- https://www.w3.org/ns/credentials/examples/v2
- https://www.w3.org/2018/credentials/v1
- https://www.w3.org/ns/credentials/v2

#### Testing locally

To test implementations with endpoints running locally, create a configuration file named
`localConfig.cjs` in the root directory of the test suite. `localConfig.cjs` should export
a json object. Add the property `implementations` to the exported object. `implementations`
should be an array of objects such as the one below:

```js
// localConfig.cjs defining local implementations
module.exports = {
  "implementations": [{
    "name": "My Company",
    "implementation": "My Implementation Name",
    "issuers": [{
      "id": "urn:uuid:my:implementation:issuer:id",
      "endpoint": "https://localhost:40443/issuers/foo/credentials/issue",
      "tags": ["eddsa-rdfc-2022"]
    }],
    "verifiers": [{
      "id": "https://localhost:40443/verifiers/z19uokPn3b1Z4XDbQSHo7VhFR",
      "endpoint": "https://localhost:40443/verifiers/z19uokPn3b1Z4XDbQSHo7VhFR/credentials/verify",
      "tags": ["eddsa-rdfc-2022"]
    }]
  }];
};
```

After adding the config file, only implementations in `localConfig.cjs` will run.

### Test Suite Settings

Additional test suite runtime configuration can be done via the `settings` key
in a `localConfig.cjs`. The current global settings are:

  * `enableInteropTests` - enable/disable the cross-implementation "interop" tests
  * `testAllImplementations` - enable/disable testing _all_ implementations (not
    just what's in `localConfig.cjs`)

Both of these settings are `false` when `localConfig.cjs` is present, but may be
overridden as below:

```js
module.exports = {
  "settings": {
    // overriding the default, false, for local testing
    "enableInteropTests": true,
    "testAllImplementations": true
  },
  "implementations": [{
    "name": "My Company",
    "implementation": "My Implementation Name",
    "issuers": [{
      "id": "urn:uuid:my:implementation:issuer:id",
      "endpoint": "https://localhost:40443/issuers/foo/credentials/issue",
      "tags": ["eddsa-rdfc-2022"]
    }],
    "verifiers": [{
      "id": "https://localhost:40443/verifiers/z19uokPn3b1Z4XDbQSHo7VhFR",
      "endpoint": "https://localhost:40443/verifiers/z19uokPn3b1Z4XDbQSHo7VhFR/credentials/verify",
      "tags": ["eddsa-rdfc-2022"]
    }]
  }, {
    // Add additional implementations as needed
  }];
```

### Tags

Tags tell the test suites which implementations' endpoints to run the test suites against.

* `vc2.0` - This tag will run the [VC Data Model 2.0 Test Suite](https://github.com/w3c/vc-data-model-2.0-test-suite) on the tagged issuer and verifier endpoints.

* `Ed25519Signature2020` - This tag will run the [Ed25519 tests](https://github.com/w3c/vc-di-ed25519signature2020-test-suite) on the tagged issuer and/or verifier endpoints.

* `BitstringStatusList` - This tag will run the [BitstringStatusList tests](https://github.com/w3c/vc-bitstring-status-list-test-suite) on the tagged issuer and/or verifier endpoints.

* `ecdsa-rdfc-2019` or `ecdsa-sd-2023` - These tags will run the
[VC Data Integrity ECDSA Test Suite](https://github.com/w3c/vc-di-ecdsa-test-suite)
on the tagged issuer and verifier endpoints.
  * Alongside this cryptosuite tag, also specify the
  `supportedEcdsaKeyTypes` property listing the ECDSA key types the
  implementation issues or can verify. Currently, the ECDSA test suite supports
  `P-256` and `P-384` ECDSA key types.

  You can specify the key types supported by your implementation in the issuer
  and verifier configs as shown in this example:
  ```jsonc
  {
    "issuers": [{
      // ...
      "supportedEcdsaKeyTypes": ["P-256"]
      "tags": ["ecdsa-rdfc-2019"]
    }, {
      // ...
      "supportedEcdsaKeyTypes": ["P-384"]
      "tags": ["ecdsa-jcs-2019"]
    }, {
      // ...
      "supportedEcdsaKeyTypes": ["P-256"]
      "tags": ["ecdsa-sd-2023"]
    }],
    "verifiers": [{
      // ...
      "supportedEcdsaKeyTypes": ["P-256", "P-384"]
      "tags": ["ecdsa-rdfc-2019", "ecdsa-sd-2023", "ecdsa-jcs-2019"]
    }]
  }
  ```

* `eddsa-rdfc-2022` - This tag will run the [VC Data Integrity EDDSA Test Suite](https://github.com/w3c/vc-di-eddsa-test-suite) on the tagged issuer and verifier endpoints.

* `eddsa-jcs-2022` - This tag will run the [VC Data Integrity EDDSA Test Suite](https://github.com/w3c/vc-di-eddsa-test-suite) on the tagged issuer and verifier endpoints.

* `bbs-2023` - This tag will run the [VC Data Integrity BBS Test Suite](https://github.com/w3c/vc-di-bbs-test-suite) on the tagged issuer and verifier endpoints.

### Validating Description

Implementation details may include more verbose vendor and implementation
descriptions by adding the following to the description JSON:

```jsonc
{
  "@context": "https://raw.githubusercontent.com/digitalbazaar/mocha-w3c-interop-reporter/refs/heads/main/context.json",
  "vendor": {
    "type": "Organization",
    "name": "...",
    "url": "...",
    "email": "..."
  },
  "type": ["TestSubject", "Software"],
  "name": "...implementation name...",
  // the rest of the implementation details as described above
}
```

## Contribute

See [the CONTRIBUTING.md file](CONTRIBUTING.md).

Pull Requests are welcome!

## License

[BSD-3-Clause](LICENSE) Copyright 2022-2024, World Wide Web Consortium
