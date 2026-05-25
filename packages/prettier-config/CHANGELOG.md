# @yokailabs/prettier-config

## 0.0.3

### Patch Changes

- Retarget repository, bugs, and homepage URLs to the Yokai-Lab org and tidy the changelog/README.

## 0.0.2

### Patch Changes

- 7b853d7: Remove the no-op `overrides` block from the Prettier config. The `excludedFiles` entry had no rule changes, so it never affected formatting — no behavior change for consumers.

## 0.0.1

### Patch Changes

- Initial Prettier config (`tabWidth: 2`, `useTabs: false`, `singleQuote: true`, `semi: true`, `trailingComma: "all"`, `printWidth: 120`, `arrowParens: "always"`, `endOfLine: "lf"`), with inline ignore patterns for common build artifacts (`dist/**`, `build/**`, `coverage/**`, `node_modules/**`) and a `README.md` covering installation and usage.
