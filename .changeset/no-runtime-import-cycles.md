---
'@yokailabs/eslint-config': minor
---

`base` (and so `node` and `react`) now reports a runtime import cycle as an error, with `import-x/no-cycle` and a resolver that follows the project's tsconfig. To upgrade, break each cycle it reports: move what both modules need into a third module, or, where an edge only carries types, write it as `import type`. A cycle made only of `import type` edges passes. A type re-export (`export type { A } from './a'`) still counts as an edge: where it closes a reported cycle, rewrite it as `import type { A } from './a'` followed by `export type { A }`. An import whose specifiers are all inline types (`import { type A } from './a'`) is not reported, though it stays a runtime import: write it as `import type`. Path aliases are followed only when the tsconfig sits in the directory lint runs from.
