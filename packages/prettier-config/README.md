# @yokailabs/prettier-config

[![npm version](https://img.shields.io/npm/v/@yokailabs/prettier-config.svg?style=flat-square)](https://www.npmjs.com/package/@yokailabs/prettier-config)
[![npm downloads](https://img.shields.io/npm/dm/@yokailabs/prettier-config.svg?style=flat-square)](https://www.npmjs.com/package/@yokailabs/prettier-config)
[![license](https://img.shields.io/npm/l/@yokailabs/prettier-config.svg?style=flat-square)](../../LICENSE)

Shared [Prettier](https://prettier.io/) configuration for Yokai Labs projects.

## Purpose

The goal of this package is **consistency across all our applications**, not strict adherence to any particular style guide.
We are not “married” to these specific rules — they simply provide a common baseline so that code looks and feels the same across projects. This helps reduce friction when switching between repos or collaborating with others.

> ⚠️ Note: Using this package is not an endorsement of any specific Prettier rule. The real value is **shared consistency**.

## Features

- Consistent code style across Yokai Labs projects
- Opinionated but flexible: change rules here once, and they apply everywhere

## Installation

```bash
npm i -D @yokailabs/prettier-config prettier
```

## Usage

In your project’s package.json, add:

```json
{
  "prettier": "@yokailabs/prettier-config"
}
```

## Examples

```bash
# Format all files
npx prettier . --write

# Check formatting (CI use case)
npx prettier . --check
```

## Development

For local development check out the repository in your workspace and from your project's root folder run:

```bash
npm i -D file:~/your-workplace-path/yokailabs-configs/packages/prettier-config
```

## Releasing

Releases are managed from the monorepo root with [Changesets](https://github.com/changesets/changesets): run `npm run changeset` to record a change, then `npm run release` to version and publish. See [CHANGELOG.md](./CHANGELOG.md) for version history.
