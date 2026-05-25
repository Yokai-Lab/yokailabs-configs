# Changelog

## 0.0.2

### Patch Changes

- 7b853d7: Remove the no-op `overrides` block from the Prettier config. The `excludedFiles` entry had no rule changes, so it never affected formatting — no behavior change for consumers.

All notable changes to `@yokailabs/prettier-config` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

- Potential updates under discussion.

## [0.0.1] - 2025-08-19

### Added

- Initial Prettier config with the following rules:
  - `tabWidth: 2`
  - `useTabs: false`
  - `singleQuote: true`
  - `semi: true`
  - `trailingComma: "all"`
  - `printWidth: 120`
  - `arrowParens: "always"`
  - `endOfLine: "lf"`
- Inline ignore patterns for common build artifacts (`dist/**`, `build/**`, `coverage/**`, `node_modules/**`).
- Documentation (`README.md`) with installation and usage instructions.

---

## Release Process

1. Update the `CHANGELOG.md` with details of the changes under a new version heading.
2. Bump the version number in `package.json` following [Semantic Versioning](https://semver.org/).
3. Commit the changes with a message like:
   ```bash
   chore(release): v0.x.x
   ```
4. Create a Git tag for the release:
   ```bash
   git tag v0.x.x
   ```
5. Push both commits and tags to the remote:
   ```bash
   git push && git push --tags
   ```
6. (When ready to publish) run:
   ```bash
   npm publish --access public
   ```
   > For local testing, you can still install via `file:` without publishing.
