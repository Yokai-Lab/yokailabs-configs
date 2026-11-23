# @yokailabs/eslint-config

[![npm version](https://img.shields.io/npm/v/@yokailabs/eslint-config.svg?style=flat-square)](https://www.npmjs.com/package/@yokailabs/eslint-config)
[![license](https://img.shields.io/npm/l/@yokailabs/eslint-config.svg?style=flat-square)](../../LICENSE)

Shared [ESLint](https://eslint.org/) flat configs for Yokai Labs TypeScript projects, in three presets: `base`, `node` and `react` (Vite + React).

## What's included

| Preset  | Import                           | Adds                                                                                                                                  |
| ------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `base`  | `@yokailabs/eslint-config/base`  | `@eslint/js` + `typescript-eslint` recommended, `simple-import-sort`, `no-nested-ternary`, `max-lines`, `import-x/no-cycle`, Prettier |
| `node`  | `@yokailabs/eslint-config/node`  | `base` + Node globals                                                                                                                 |
| `react` | `@yokailabs/eslint-config/react` | `base` + React (`react`, `react-hooks`, `react-refresh`), `jsx-a11y`, a form-field `id`/`name` rule, browser globals                  |

The bare `@yokailabs/eslint-config` import is the `react` preset, kept for existing consumers.
Targets **ESLint 9**: `eslint-plugin-react` and `eslint-plugin-jsx-a11y` don't support ESLint 10 yet.

## Installation

```bash
npm i -D @yokailabs/eslint-config eslint prettier typescript
```

`eslint`, `prettier`, and `typescript` are peer dependencies — install them in your project.

## Usage

```js
// eslint.config.js
import yokai from '@yokailabs/eslint-config/react'; // or /node

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

### File length

`base` caps each file at 400 lines of code with `max-lines`, comments and blank lines excluded and
`*.test.{ts,tsx}` exempt, so a module stays small enough to read whole. A project adopting it
pins each file already past the cap at its current count, after `...yokai`, and lowers the pin
whenever the file shrinks:

```js
{
  files: ['src/engine.ts'],
  rules: { 'max-lines': ['error', { max: 1243, skipComments: true, skipBlankLines: true }] },
},
```

### Import cycles

`base` reports a runtime import cycle with `import-x/no-cycle`, since an ESM cycle can read a
binding before its module has finished evaluating. Imports are resolved through the project's
tsconfig, so `.js`-for-`.ts` specifiers, `.ts` extensions and path aliases such as `@/` are all
followed; packages in `node_modules` are not. A cycle made only of `import type` edges passes,
since those are erased at compile time. A project adopting it breaks each cycle it reports: move
what both modules need into a third, or turn an edge that only carries types into `import type`.

An import whose specifiers are all inline types (`import { type A } from './a'`) is not reported
either, though `verbatimModuleSyntax` keeps it as a runtime `import './a'`. Write type-only
imports as `import type`.

## Releasing

Managed from the monorepo root with [Changesets](https://github.com/changesets/changesets):
`npx changeset` to record a change, `npx changeset version` to bump, then push to `main`
— CI publishes via OIDC. See [CHANGELOG.md](./CHANGELOG.md).
