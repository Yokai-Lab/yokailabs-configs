# Yokai Labs Configs

[![npm version](https://img.shields.io/npm/v/@yokailabs/prettier-config.svg?style=flat-square)](https://www.npmjs.com/package/@yokailabs/prettier-config)
[![npm downloads](https://img.shields.io/npm/dm/@yokailabs/prettier-config.svg?style=flat-square)](https://www.npmjs.com/package/@yokailabs/prettier-config)
[![license](https://img.shields.io/github/license/Yokai-Lab/yokailabs-configs.svg?style=flat-square)](./LICENSE)

A collection of shared configuration packages for Yokai Labs projects.
The goal is **consistency across applications**, not strict enforcement of any particular style.

## Packages

- [`@yokailabs/prettier-config`](./packages/prettier-config)
  Shared Prettier configuration.

## Development

This repo uses [npm workspaces](https://docs.npmjs.com/cli/v10/using-npm/workspaces) and [Changesets](https://github.com/changesets/changesets) for versioning and publishing.

### Typical workflow

```bash
# install deps
npm install

# format code in repo
npm run fmt

# create a changeset for version bump
npm run changeset

# release & publish packages
npm run release
```

## Publishing

It’s best to publish from the **monorepo root** using the workspace flag:

```bash
# Dry run first (shows what would be published)
npm publish -w @yokailabs/prettier-config --access public --dry-run

# Publish for real
npm publish -w @yokailabs/prettier-config --access public
```

Alternatively, you can publish from within a specific package folder:

```bash
cd packages/prettier-config
npm publish --access public
```
