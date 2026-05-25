# @yokailabs/tsconfig

[![npm version](https://img.shields.io/npm/v/@yokailabs/tsconfig.svg?style=flat-square)](https://www.npmjs.com/package/@yokailabs/tsconfig)
[![license](https://img.shields.io/npm/l/@yokailabs/tsconfig.svg?style=flat-square)](../../LICENSE)

Shared [TypeScript](https://www.typescriptlang.org/) configs for Yokai Labs projects, extracted from a battle-tested Vite + React setup.

## Purpose

Compiler strictness should not deviate between our projects. This package is the single source of truth for that baseline; per-project bits (path aliases, `include`, `tsBuildInfoFile`, `references`) stay in each repo.

## Configs

| Entry                    | For                                  | Adds over base                              |
| ------------------------ | ------------------------------------ | ------------------------------------------- |
| `@yokailabs/tsconfig/base` | any TS                             | strict + bundler-mode + `noUnused*` etc.    |
| `@yokailabs/tsconfig/app`  | browser app (Vite + React)         | `DOM` libs, `react-jsx`, `vite/client` types |
| `@yokailabs/tsconfig/node` | Node-side (vite.config, scripts)   | `ES2023` lib, `node` types                  |

## Installation

```bash
npm i -D @yokailabs/tsconfig typescript
```

## Usage

A typical Vite + React SPA uses the solution-style layout — a root `tsconfig.json`
that only references the per-environment configs:

```jsonc
// tsconfig.json
{
  "files": [],
  "references": [{ "path": "./tsconfig.app.json" }, { "path": "./tsconfig.node.json" }]
}
```

```jsonc
// tsconfig.app.json
{
  "extends": "@yokailabs/tsconfig/app",
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["src"]
}
```

```jsonc
// tsconfig.node.json
{
  "extends": "@yokailabs/tsconfig/node",
  "compilerOptions": { "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo" },
  "include": ["vite.config.ts"]
}
```

> `types` in the shared configs include `vitest/globals` (the Yokai stack standardizes
> on Vitest). `types` does not merge across `extends`, so if you override it locally,
> re-list what you need.

## Releasing

Managed from the monorepo root with [Changesets](https://github.com/changesets/changesets):
`npx changeset` to record a change, `npx changeset version` to bump, then push to `main`
— CI publishes via OIDC. See [CHANGELOG.md](./CHANGELOG.md).
