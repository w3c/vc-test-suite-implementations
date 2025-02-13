<!--
Copyright 2025 Digital Bazaar, Inc.

SPDX-License-Identifier: BSD-3-Clause
-->

# Testing in docker

To run your implementation against all test suites from one location, you can use this docker-compose project.

## Pre requisites
- [Docker](https://docs.docker.com/compose/install/)

## Setup

Make sure you are in the `docker` directory, then copy the `implementation` example file:
```bash
cd ./docker
cp implementation.example.yml implementation.yml
```
Edit the local config details to match your implementation.

Once you are done, you can run the test-suites with:
```bash
docker compose up --build
```

When the tests are completed, you will be able to access the reports in your browser:
- [vc-data-model-v2](http://vc-data-model.docker.localhost/)
- [vc-bitstring-status-list](http://vc-bitstring-status-list.docker.localhost/)
- [vc-di-eddsa](http://vc-di-eddsa.docker.localhost/)
- [vc-di-ecdsa](http://vc-di-ecdsa.docker.localhost/)
- [vc-di-bbs](http://vc-di-bbs.docker.localhost/)
