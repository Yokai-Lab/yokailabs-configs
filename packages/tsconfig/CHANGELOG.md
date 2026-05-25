# @yokailabs/tsconfig

## 0.1.1

### Patch Changes

- Fix the README usage example: drop the now-deprecated `baseUrl` and use a relative `paths` target (`./src/*`), so it works on TypeScript 6+ (where `baseUrl` warns and non-relative `paths` targets error).

## 0.1.0

### Minor Changes

- Initial release: shared `base` / `app` / `node` TypeScript configs for Yokai Labs Vite + React projects, extracted from the sovra-frontend setup (strict + bundler-mode baseline; the sovra-specific server config is not included).
