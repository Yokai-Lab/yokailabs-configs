# @yokailabs/eslint-config

[![npm version](https://img.shields.io/npm/v/@yokailabs/eslint-config.svg?style=flat-square)](https://www.npmjs.com/package/@yokailabs/eslint-config)
[![license](https://img.shields.io/npm/l/@yokailabs/eslint-config.svg?style=flat-square)](../../LICENSE)

Shared [ESLint](https://eslint.org/) flat config for Yokai Labs projects (Vite + React + TypeScript), extracted from a battle-tested setup.

## What's included

`@eslint/js` + `typescript-eslint` recommended, React (`react`, `react-hooks`,
`react-refresh`), `jsx-a11y`, `simple-import-sort` (with a sensible grouping),
`no-nested-ternary`, a form-field `id`/`name` accessibility rule, and Prettier
integration. Targets **ESLint 9** (the plugin ecosystem doesn't support ESLint 10 yet).

## Installation

```bash
npm i -D @yokailabs/eslint-config eslint prettier typescript
```

`eslint`, `prettier`, and `typescript` are peer dependencies — install them in your project.

## Usage

```js
// eslint.config.js
import yokai from '@yokailabs/eslint-config';

export default [
  ...yokai,
  // project-specific overrides go here, e.g. design-token enforcement:
  // {
  //   files: ['**/*.{ts,tsx}'],
  //   rules: { 'no-restricted-syntax': ['error', /* your design-token selectors */] },
  // },
];
```

Design-system-specific rules (e.g. forbidding hardcoded colors in favour of theme
tokens) are intentionally **not** bundled — add them per project as above.

## Releasing

Managed from the monorepo root with [Changesets](https://github.com/changesets/changesets):
`npx changeset` to record a change, `npx changeset version` to bump, then push to `main`
— CI publishes via OIDC. See [CHANGELOG.md](./CHANGELOG.md).
