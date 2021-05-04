# `api`

## Description

A REST interface to interact with the [engine](../packages/engine_umbrella/apps/engine).

## Development

### Technical details

- We use [OpenAPI](https://swagger.io/specification/) to describe the API
- We use [ReDoc](https://github.com/Redocly/redoc/blob/master/cli/README.md) to generate the documentation from the OpenAPI description
- We use [Dredd](https://dredd.org/en/latest/index.html) to test our OpenAPI description

### Run it

- Install dependencies

  ```bash
  nvm use
  npm i
  ```

- Generate Typescript types from openapi specification

  ```bash
  npm run generate-ts
  ```

- Have documentation generated while you code available at http://localhost:8080

  ```bash
  npm run spec:watch
  ```

- Generate documentation static files

  ```bash
  npm run spec:build
  ```

- Run tests for validating openapi specification

  ```bash
  npm run spec:test
  ```

- Run it (available at http://localhost:9000)

  ```bash
  npm run dev
  ```
