import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tseslint from 'typescript-eslint';

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
]);
