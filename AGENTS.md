# Agents

Read the README's [Development](./README.md#development), [Versioning](./README.md#versioning)
and [Publishing](./README.md#publishing) sections before changing anything. They are this repo's
rules, and they bind agents as much as people.

Release only when the task asks for a release. A release task first adds the changesets for
Dependabot's bumps that the README's [Publishing](./README.md#publishing) section describes.
Then it runs `npx changeset version`, commits the versions and changelogs it writes, and opens a
PR. Merging that PR is the maintainer's go-ahead, and `release.yml` then
publishes. Never run `changeset publish` or `npm run release`, and never edit a `version` field
or a `CHANGELOG.md` by hand.
