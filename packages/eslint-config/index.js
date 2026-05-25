import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettierConfig from 'eslint-config-prettier';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettierPlugin from 'eslint-plugin-prettier';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

// Shared ESLint flat config for Yokai Labs Vite + React + TypeScript projects.
// Spread it in your eslint.config.js and add project-specific overrides after:
//   import yokai from '@yokailabs/eslint-config';
//   export default [...yokai, { rules: { /* project rules */ } }];
export default defineConfig([
  globalIgnores(['coverage', 'dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      reactPlugin.configs.flat.recommended,
      jsxA11y.flatConfigs.recommended,
      prettierConfig,
    ],
    plugins: {
      prettier: prettierPlugin,
      'simple-import-sort': simpleImportSort,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'prettier/prettier': 'error',
      'react/react-in-jsx-scope': 'off',
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
      // Project-specific design-token enforcement (e.g. forbidding hardcoded
      // colors) is intentionally NOT included here — add it per project.
      'no-restricted-syntax': [
        'error',
        {
          selector:
            'JSXOpeningElement[name.name=/^(input|textarea|select)$/]:not(:has(JSXAttribute[name.name="id"])):not(:has(JSXAttribute[name.name="name"]))',
          message:
            'Form fields (input/textarea/select) must have an id or name attribute. Browsers use these for autofill, and accessibility tooling flags their absence. Add an eslint-disable comment if a truly anonymous field is intended.',
        },
      ],
    },
  },
  {
    files: ['**/*.test.{ts,tsx}', 'src/test/**/*.{ts,tsx}'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
]);
