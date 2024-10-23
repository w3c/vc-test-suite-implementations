<!--
Copyright 2023 - 2024 Digital Bazaar, Inc.

SPDX-License-Identifier: BSD-3-Clause
-->

# w3c/vc-test-suite-implementations  ChangeLog

## 2.0.1 - 2024-10-31

### Fixed
- Code for sanitizing request headers is more resilient.

## 2.0.0 - 2024-07-13

### Added
- Support for a new `localConfig.cjs` feature.
  - Adds options for test suite config and local implementation endpoint configuration.

### Removed
- **BREAKING**: Removed support for `.localImplementationsConfig.cjs`.
- **BREAKING**: Removed support for `localImplementationsConfig.cjs`.
- **BREAKING**: Remove requirement of `only: true` use in local configuration.

## 1.0.0 - 2024-03-28

### Added
- A new option `only` which when added to a local implementation manifest results in only that manifest being run.
- Support for `localImplementationsConfig.cjs` a non-dot file config file in addition to the existing dot file.

## Before 1.0.0

- See git history for changes.
