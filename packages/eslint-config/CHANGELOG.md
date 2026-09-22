# @yokailabs/eslint-config

## 0.2.0

### Minor Changes

- Split into `base`, `node` and `react` presets so Node projects stop loading React rules and browser globals. The bare import is still the React preset, so existing consumers need no changes. Dependencies are bumped within ESLint 9 (typescript-eslint 8.70, globals 17, simple-import-sort 14); `react-refresh/only-export-components` now also allows compound components.

## 0.1.0

### Minor Changes

- Initial release: shared ESLint flat config for Yokai Labs Vite + React + TypeScript projects, extracted from sovra-frontend (js/typescript-eslint recommended, React + hooks + refresh, jsx-a11y, simple-import-sort, Prettier). Targets ESLint 9. The sovra-specific design-token rule is left to consumers.
