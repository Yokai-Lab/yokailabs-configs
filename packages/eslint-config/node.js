import { defineConfig } from 'eslint/config';
import globals from 'globals';

import base from './base.js';

// Node.js projects: CLIs, servers, scripts.
export default defineConfig([
  ...base,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      globals: globals.node,
    },
  },
]);
