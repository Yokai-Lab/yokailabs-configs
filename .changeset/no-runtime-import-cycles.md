---
'@yokailabs/eslint-config': minor
---

`base` (and so `node` and `react`) now reports a runtime import cycle as an error, with `import-x/no-cycle` and a resolver that follows the project's tsconfig. To upgrade, break each cycle it reports: move what both modules need into a third module, or, where an edge only carries types, write it as `import type`. A cycle made only of `import type` edges passes.
