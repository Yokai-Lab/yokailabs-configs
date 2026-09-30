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

The packages have no code of their own to unit test, so their test is `npm run smoke` plus
`npm run fmt:check`. Smoke lints a file with every ESLint preset and typechecks one with every
tsconfig, the way a consumer would, so a dependency bump that breaks a plugin, a rule or a
TypeScript option fails here first. It also fails when `npm ls` does, that is when the installed
tree contradicts a `package.json`. Smoke loads `@yokailabs/prettier-config` only through
`prettier/prettier` on a single line, so `fmt:check`, which formats this repo with that package,
is what tests its options. The pre-push hook runs both, and so does CI on pull requests and on
`main`. A new preset, tsconfig or export adds itself to [`scripts/smoke.mjs`](./scripts/smoke.mjs),
or nothing tests it.

A change to what a package publishes needs a changeset, written with `npx changeset`, because
only a release gets it to consumers and the changeset is what makes one. That means any file in
the package's `files` (npm also always ships its `README.md`), and the `package.json` fields a
consumer's install or load reads: `dependencies`, `peerDependencies`, `exports`, `main`, `type`
and `engines`. Fields such as `devDependencies` and `scripts` need none, and neither does the
`CHANGELOG.md`, which `npx changeset version` writes. A change outside `packages/` needs none
either, since nothing there is published.

Dependabot's weekly PR is the one exception: it bumps published `dependencies` without a
changeset, and merges that way. Its bumps wait on `main` for the package's next release, which
adds a patch changeset for them (see [Publishing](#publishing)), so that one routine update does
not cost a release every week.

The majors of `eslint`, `@eslint/js` and `typescript` move only in a deliberate release, which is
why [`.github/dependabot.yml`](./.github/dependabot.yml) ignores them. A new `eslint` or
`@eslint/js` major must raise `eslint-config`'s `eslint` peer range with it, or the package ships
dependencies that contradict its peer. A new `typescript` major must stay within the range the
bundled `typescript-eslint` supports, or linting breaks for consumers on it. Published
dependencies stay pinned to exact versions, so what a consumer installs is what smoke tested.

A rule goes into a preset only when it fits every consumer of that preset, since a preset cannot
tell its consumers apart. A project-specific rule stays in the consumer's own config, as
`react.js` already says about design tokens.

## Versioning

The packages follow [semver](https://semver.org), so a version number says what a change does to
a consumer.

While a package is 0.x, a breaking change is a minor bump and everything else is a patch.
Consumers depend with `^0.x.y`, which takes patches automatically, so a breaking patch would
reach them unasked. At 0.0.x, where `@yokailabs/prettier-config` is today, a caret pins the exact
version, but the same classification applies, so the version still says what the change does. In
the `npx changeset` prompt, that means: choose `minor` for a breaking change, `patch` for
everything else, and never `major` while a package is 0.x, because Changesets takes 0.2.0 to
1.0.0 on a major.

For a config package, breaking means anything that can fail a consumer's lint, typecheck or
format check:

- a rule turned on, or raised to `error`;
- a stricter compiler option;
- a changed Prettier option, which fails `prettier --check`, and lint too, since the presets run
  `prettier/prettier` as an error;
- a removed preset or export;
- a raised peer range, or a raised `engines.node` floor.

A breaking change's changeset summary says what a consumer must change, because that summary
becomes the changelog entry they read when they upgrade.

## Publishing

Publishing happens in CI, token-less over npm trusted publishing:

```bash
npx changeset          # declare the bump: which package, and patch or minor while it is 0.x (see Versioning)
npx changeset version  # apply it locally: versions and changelogs
git commit -am "..." && git push   # release.yml publishes whatever is unpublished
```

A release is the commit that runs `npx changeset version`. The maintainer pushes it straight to
`main`, or it comes as a PR, which publishes when merged: either way `release.yml` publishes on
`main`, and only what `main` holds is released.

A dependency bump reaches consumers only once a changeset releases it. Dependabot's bumps land
without one, so a release first adds a patch changeset for each package whose published
dependencies changed since its last release without a changeset, and the bumps go out with it.
Only a brand-new package name needs a manual first `npm publish`, since trusted publishing cannot
create a name.
