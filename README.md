# VC Test Suite Implementations

This repository contains a list of all implementations that have registered to
be regularly run against the
[W3C Verifiable Credentials](https://www.w3.org/groups/wg/vc/) test suites.

## Table of Contents

- [VC Test Suite Implementations](#vc-test-suite-implementations)
  - [Table of Contents](#table-of-contents)
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

Implementations added to this package are tested against various test suites in order to demonstrate
[W3C Verifiable Credentials](https://www.w3.org/groups/wg/vc/) interoperability.

## Security

Please do not commit any sensitive materials such as oauth2 client secrets or
private key information used for signing
[Authorization Capabilities](https://w3c-ccg.github.io/zcap-spec/) or
[HTTP Message Signatures](https://www.ietf.org/archive/id/draft-ietf-httpbis-message-signatures-08.html).

## Install

- Node.js 18+ is required.

### NPM

To install via NPM:

```
npm install w3c/vc-test-suite-implementations
```

### Development

To install locally (for development):

```
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
    "method": "POST",
    "zcap": {
      "capability": "{\"@context\":[\"https://w3id.org/zcap/v1\",\"https://w3id.org/security/suites/ed25519-2020/v1\"],\"id\":\"urn:uuid:4d44084c-334e-46dc-ac23-5e26f75262b6\",\"controller\":\"did:key:zFoo\",\"parentCapability\":\"urn:zcap:root:https%3A%2F%2Fmy.implementation.net%2Fissuers%2Fz19wCeJafpsTzvA6hZksz7TYF\",\"invocationTarget\":\"https://my.implementation.net/issuers/z19wCeJafpsTzvA6hZksz7TYF/credentials/issue\",\"expires\":\"2022-05-29T17:26:30Z\",\"proof\":{\"type\":\"Ed25519Signature2020\",\"created\":\"2022-02-28T17:26:30Z\",\"verificationMethod\":\"did:key:z6Mkk2x1J4jCmaHDyYRRW1NB7CzeKYbjo3boGfRiefPzZjLQ#z6Mkk2x1J4jCmaHDyYRRW1NB7CzeKYbjo3boGfRiefPzZjLQ\",\"proofPurpose\":\"capabilityDelegation\",\"capabilityChain\":[\"urn:zcap:root:https%3A%2F%2Fmy.implementation.net%2Fissuers%2Fz19wCeJafpsTzvA6hZksz7TYF\"],\"proofValue\":\"zBar\"}}",
      "keySeed": "KEY_SEED_DB"
    },
    "tags": ["ecdsa-rdfc-2019", "P-256"]
  }],
  "verifiers": [{
    "id": "https://product.example.com/verifiers/z19uokPn3b1Z4XDbQSHo7VhFR",
    "endpoint": "https://product.example.com/verifiers/z19uokPn3b1Z4XDbQSHo7VhFR/credentials/verify",
    "method": "POST",
    "zcap": {
      "capability": "{\"@context\":[\"https://w3id.org/zcap/v1\",\"https://w3id.org/security/suites/ed25519-2020/v1\"],\"id\":\"urn:uuid:41473f9f-9e44-4ac9-9ac2-c86a6f695703\",\"controller\":\"did:key:zFoo\",\"parentCapability\":\"urn:zcap:root:https%3A%2F%2Fmy.implementation.net%3A40443%2Fverifiers%2Fz19uokPn3b1Z4XDbQSHo7VhFR\",\"invocationTarget\":\"https://my.implementation.net/verifiers/zBar/credentials/verify\",\"expires\":\"2023-03-17T17:39:49Z\",\"proof\":{\"type\":\"Ed25519Signature2020\",\"created\":\"2022-03-17T17:39:49Z\",\"verificationMethod\":\"did:key:zFoo#zBar\",\"proofPurpose\":\"capabilityDelegation\",\"capabilityChain\":[\"urn:zcap:root:https%3A%2F%2Fmy.application.net%2Fverifiers%2FzFoo\"],\"proofValue\":\"zBar\"}}",
      "keySeed": "KEY_SEED_DB"
    },
    "tags": ["ecdsa-rdfc-2019"]
  }]
}
```

Please note: implementations may specify authorization parameters for oauth2 or
zcaps, but not both. Implementations may also not specify any authorization
parameters, in which case they do not specify `oauth2` or `zcap` properties.

#### Testing locally

If you want to test your implementation locally, you can add a configuration
file in the root directory of the specific test suite that you are running.

```
localImplementationsConfig.cjs
```

That file must be a common js module that exports an array of implementations:

```js
// localImplementationsConfig.cjs defining local implementations
module.exports = [{
  "name": "My Company",
  "implementation": "My Implementation Name",
  "issuers": [{
    "id": "urn:uuid:my:implementation:issuer:id",
    "endpoint": "https://localhost:40443/issuers/foo/credentials/issue",
    "method": "POST",
    "tags": ["ecdsa-rdfc-2019", "P-256", "localhost"]
  }],
  "verifiers": [{
    "id": "https://localhost:40443/verifiers/z19uokPn3b1Z4XDbQSHo7VhFR",
    "endpoint": "https://localhost:40443/verifiers/z19uokPn3b1Z4XDbQSHo7VhFR/credentials/verify",
    "method": "POST",
    "tags": ["ecdsa-rdfc-2019", "localhost"]
  }]
}];
```

### Tags

Tags tell the test suites which implementations to run the test suites against.

`vc2.0` - This tag will run the [VC Data Model 2.0 Test Suite](https://github.com/digitalbazaar/vc-data-model-2-test-suite) on your issuer and verifier endpoints.

`Ed25519Signature2020` - This tag will run the [Ed25519 tests](https://github.com/w3c-ccg/di-ed25519-test-suite) on either your issuer and/or verifier.

`ecdsa-rdfc-2019` or `ecdsa-sd-2023` - These tags will run
the [VC Data Integrity ECDSA Test Suite](https://github.com/w3c-ccg/vc-di-ecdsa-test-suite) on your issuer and verifier endpoints.
Note: Along with the cryptosuite tag, for the issuers you should also specify
the key type that your implementation supports in the tags. Currently, the test
suite supports `P-256` and `P-384` key types.

`eddsa-rdfc-2022` - This tag will run the [VC Data Integrity EDDSA Test Suite](https://github.com/w3c-ccg/di-eddsa-2022-test-suite) on your issuer and verifier endpoints.

## Contribute

See [the CONTRIBUTING.md file](CONTRIBUTING.md).

Pull Requests are welcome!

## License

See [the LICENSE.md file](LICENSE.md)
