import { defineConfig } from 'eslint/config';
import prettierConfig from 'eslint-config-prettier';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';

import base from './base.js';

// Vite + React SPAs in the browser.
export default defineConfig([
  ...base,
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      reactPlugin.configs.flat.recommended,
      jsxA11y.flatConfigs.recommended,
      // Again after the React presets, so none of their stylistic rules fight Prettier.
      prettierConfig,
    ],
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
      'react/react-in-jsx-scope': 'off',
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
