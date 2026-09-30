# CLAUDE.md

Rules for a coding agent working in this repo, each with the reason behind it. How to develop and
how a release is cut are in the [README](./README.md#development); this file covers only what the
code does not show.

## A package change needs a changeset

A change to anything a package publishes needs a changeset, written with `npx changeset`, naming
the package and its bump. What a package publishes is every file in its `files` (which includes
its `README.md`, so a fix to a package README needs a patch changeset too) and everything npm
ships from its `package.json`: `dependencies`, `peerDependencies`, `exports` and `main`. Without a
changeset the change sits on `main` and never reaches a consumer. A change outside `packages/`
(the root README, CI, `scripts/`, this file) publishes nothing and needs no changeset.

## Never version or release

Stop after `npx changeset`. Never run `changeset version`, `npm run release` (which runs
`changeset version` and `changeset publish`), or `changeset publish`, and never edit a `version`
field or a `CHANGELOG.md`. Merging a version bump to `main` publishes to npm through
`.github/workflows/release.yml`, and when to release is the maintainer's call. The README's
[Publishing](./README.md#publishing) section and the package READMEs describe the version and
publish steps: those belong to the maintainer, not to an agent.

## Anything that can fail a consumer's checks is a minor bump while 0.x

While a package is 0.x, a change that can fail a consumer's lint, typecheck or formatting check is
a minor bump: a rule turned on or raised to error, a stricter compiler option, a changed Prettier
option (which fails `prettier --check`, and lint too, since the ESLint presets run
`prettier/prettier` as an error), a removed preset or export. Everything else is a patch.
Consumers depend with `^0.x.y`, and for a package at 0.1 or above that caret takes patches
automatically and minors only by choice, so a breaking patch would reach them unasked. A package
still at 0.0.x (such as `@yokailabs/prettier-config`) is pinned by a caret to its exact version,
so none of its bumps reach a consumer unasked; classify them the same way anyway, so the version
says what the change does.

## ESLint and TypeScript majors move only with the peer range

A major of `eslint` or `@eslint/js` moves only in a release that also raises `eslint-config`'s
`eslint` peer range, because the bump alone ships a config whose dependencies contradict its
`^9` peer. A major of `typescript` moves only in a deliberate release too, because the bundled
`typescript-eslint` supports a bounded TypeScript range and a new major can fall outside it. This
is why `.github/dependabot.yml` ignores those three majors (its comment says the same). Published
dependencies stay pinned to exact versions, so what a consumer installs is what the smoke test
ran against.

## The test is the smoke test and the format check

The packages have no code of their own, so their test is `npm run smoke` plus
`npm run fmt:check`. `npm run smoke` (`scripts/smoke.mjs`) loads every ESLint preset and
typechecks with every tsconfig the way a consumer would. It loads `@yokailabs/prettier-config`
only through the presets' `prettier/prettier` rule on a single line, so it does not test the
package's options: `npm run fmt:check` does, because the root `package.json` formats this repo
with it. The pre-push hook runs both, as CI does. A new preset,
tsconfig or export must add itself to `scripts/smoke.mjs`, or nothing tests it.
