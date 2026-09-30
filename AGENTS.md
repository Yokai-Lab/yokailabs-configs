# Agents

Read the README's [Development](./README.md#development), [Versioning](./README.md#versioning)
and [Publishing](./README.md#publishing) sections before changing anything. They are this repo's
rules, and they bind agents as much as people.

Release only when the task asks for a release. A release task first adds a patch changeset for
each package whose published dependencies changed since its last release without one, or a minor
one for a bump that is breaking under the README's Versioning, decided by reading that bump's
changelog, so those bumps go out with it. Then it runs `npx changeset version`, commits the versions and changelogs
it writes, and opens a PR. Merging that PR is the maintainer's go-ahead, and `release.yml` then
publishes. Never run `changeset publish` or `npm run release`, and never edit a `version` field
or a `CHANGELOG.md` by hand.
