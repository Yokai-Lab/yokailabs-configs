import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettierConfig from 'eslint-config-prettier';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import importX from 'eslint-plugin-import-x';
import prettierPlugin from 'eslint-plugin-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tseslint from 'typescript-eslint';

// import-x's TypeScript parser and extension settings, without its string-named legacy resolver:
// the resolver below is passed as an object, so it loads from this package, not the consumer's.
const { 'import-x/resolver': _legacyResolver, ...importXTypeScriptSettings } = importX.flatConfigs.typescript.settings;

// Environment-agnostic rules shared by every Yokai Labs TypeScript project.
// Projects use `./node` or `./react`, which layer globals (and React rules) on top.
export default defineConfig([
  globalIgnores(['coverage', 'dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, tseslint.configs.recommended, prettierConfig],
    plugins: {
      prettier: prettierPlugin,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'prettier/prettier': 'error',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // Side-effect imports (e.g. import './styles.css')
            ['^\\u0000'],
            // React ecosystem
            ['^react'],
            // External packages — scoped (not @/) and unscoped
            ['^@(?!/)', '^\\w'],
            // Internal @/ aliases
            ['^@/'],
            // Relative imports
            ['^\\.'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
      'no-nested-ternary': 'error',
    },
  },
  // A file holds one responsibility, so it stays small enough for a person or an agent to read
  // whole. Comments and blank lines don't count, so cutting comments never satisfies the cap.
  // Tests are exempt: their cases are independent and found by name.
  {
    files: ['**/*.{ts,tsx}'],
    ignores: ['**/*.test.{ts,tsx}'],
    rules: {
      'max-lines': ['error', { max: 400, skipComments: true, skipBlankLines: true }],
    },
  },
  // No runtime import cycles: in ESM a cycle can read a binding before its module has finished
  // evaluating, and it usually marks a layering mistake. `import type` edges are erased at compile
  // time, so a cycle made only of them passes. import-x also skips an import whose specifiers are
  // all inline types (`import { type A }`), though `verbatimModuleSyntax` keeps it as a runtime
  // `import './a'`: such a cycle goes unreported. The TypeScript resolver reads the project's
  // tsconfig, so `./a.js` → `a.ts`, `.ts` extensions and `@/` path aliases are all followed. Called
  // with no options, it looks for that tsconfig (or jsconfig) only in the directory lint runs from:
  // a project that keeps it elsewhere gets no cycle reported through its aliases.
  {
    files: ['**/*.{ts,tsx}'],
    plugins: { 'import-x': importX },
    settings: {
      ...importXTypeScriptSettings,
      'import-x/resolver-next': [createTypeScriptImportResolver()],
    },
    rules: {
      'import-x/no-cycle': ['error', { ignoreExternal: true }],
    },
  },
]);
