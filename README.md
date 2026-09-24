# Yokai Labs Configs

[![npm version](https://img.shields.io/npm/v/@yokailabs/prettier-config.svg?style=flat-square)](https://www.npmjs.com/package/@yokailabs/prettier-config)
[![npm downloads](https://img.shields.io/npm/dm/@yokailabs/prettier-config.svg?style=flat-square)](https://www.npmjs.com/package/@yokailabs/prettier-config)
[![license](https://img.shields.io/github/license/Yokai-Lab/yokailabs-configs.svg?style=flat-square)](./LICENSE)

A collection of shared configuration packages for Yokai Labs projects.
The goal is **consistency across applications**, not strict enforcement of any particular style.

## Packages

- [`@yokailabs/prettier-config`](./packages/prettier-config)
  Shared Prettier configuration.
- [`@yokailabs/eslint-config`](./packages/eslint-config)
  Shared ESLint flat config, with `base`, `node` and `react` presets.
- [`@yokailabs/tsconfig`](./packages/tsconfig)
  Shared tsconfigs: `base`, `app` (Vite and React) and `node`.

## Development

This repo uses [npm workspaces](https://docs.npmjs.com/cli/v10/using-npm/workspaces) and
[Changesets](https://github.com/changesets/changesets). `npm install` sets up the git hooks.

The packages have no code of their own to unit test, so their test is `npm run smoke`: it lints
a file with every ESLint preset and typechecks one with every tsconfig, the way a consumer would,
so a dependency bump that breaks a plugin, a rule or a TypeScript option fails here first. The
pre-push hook runs it with `npm run fmt:check`, and so does CI on pull requests and on `main`.

## Publishing

Publishing happens in CI, token-less over npm trusted publishing:

```bash
npx changeset          # declare the bump: which package, patch/minor/major
npx changeset version  # apply it locally: versions and changelogs
git commit -am "..." && git push   # release.yml publishes whatever is unpublished
```

A dependency bump reaches consumers only once a changeset releases it. Only a brand-new package
name needs a manual first `npm publish`, since trusted publishing cannot create a name.
