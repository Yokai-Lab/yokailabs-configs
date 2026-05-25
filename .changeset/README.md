# Changesets

This repo uses [Changesets](https://github.com/changesets/changesets) to version and publish packages.

## Typical flow

1. Create a changeset (choose patch/minor/major and select packages):

   ```bash
   npm run changeset
   ```

   This adds a markdown file under `.changeset/`.

2. Commit the changeset:

   ```bash
   git add -A
   git commit -m "chore: add changeset"
   ```

3. When ready to release:

   ```bash
   npm run release
   ```

   - Applies versions in affected packages
   - Updates CHANGELOGs
   - Publishes any public packages

> Base branch: `main`. Access: `public`. Internal deps are bumped at `patch` when needed.
