# `api`

## Description

A simpler REST interface towards the [engine](../packages/engine_umbrella/apps/engine).

## Development

- Install dependencies

  ```bash
  nvm use
  npm i
  ```

- Have documentation generated while you code available at http://localhost:8080

  ```bash
  npm run spec: watch
  ```

- Generate documentation static files

  ```bash
  npm run spec: build
  ```

- Run tests for validating openapi specification

  ```bash
  npm run spec:test
  ```

- Run it

  ```bash
  npm run dev
  ```
