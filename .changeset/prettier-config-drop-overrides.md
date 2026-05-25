---
'@yokailabs/prettier-config': patch
---

Remove the no-op `overrides` block from the Prettier config. The `excludedFiles` entry had no rule changes, so it never affected formatting — no behavior change for consumers.
