// Uses every published config the way a consumer would, so a dependency bump that breaks a
// plugin, renames a rule or drops an export fails here rather than in the first repo to upgrade.
// These packages have no code of their own to unit test; this is their test.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const failures = [];

// The installed tree matches every package.json: a stale lockfile can nest a dependency the
// package no longer asks for, and the presets would then be smoked against versions no consumer
// installs. This runs first, and eslint is imported below it, so a tree too broken to load
// eslint still reports why.
try {
  execFileSync('npm', ['ls'], { stdio: 'pipe' });
} catch (err) {
  const output = `${String(err.stdout).trim()}\n${String(err.stderr).trim()}`.trim();
  failures.push(`npm ls: the installed tree contradicts a package.json (run \`npm ci\`)\n${output}`);
}

// Each ESLint preset lints a clean file without a single message: loading the config validates
// every rule and its options, and linting runs every plugin.
for (const [preset, file] of [
  ['', 'smoke.tsx'],
  ['/base', 'smoke.ts'],
  ['/node', 'smoke.ts'],
  ['/react', 'smoke.tsx'],
]) {
  const name = `@yokailabs/eslint-config${preset}`;
  try {
    const { ESLint } = await import('eslint');
    const { default: config } = await import(name);
    const eslint = new ESLint({ overrideConfigFile: true, overrideConfig: config });
    const [result] = await eslint.lintText('export const answer = 42;\n', { filePath: file });
    if (result.messages.length > 0) failures.push(`${name}: ${result.messages.map((m) => m.message).join('; ')}`);
  } catch (err) {
    failures.push(`${name}: ${err.message}`);
  }
}

// Each tsconfig resolves through the package's exports, and TypeScript accepts its options by
// typechecking a file with them. `types` is cleared: it names packages the consumer installs
// (vite, vitest, node), which this repo does not.
const dir = mkdtempSync(join(import.meta.dirname, '..', '.smoke-'));
try {
  writeFileSync(join(dir, 'smoke.ts'), 'export const answer: number = 42;\n');
  for (const preset of ['base', 'app', 'node']) {
    const tsconfig = { extends: `@yokailabs/tsconfig/${preset}`, compilerOptions: { types: [] } };
    writeFileSync(join(dir, 'tsconfig.json'), JSON.stringify(tsconfig));
    try {
      execFileSync('npx', ['tsc', '--noEmit', '-p', dir], { stdio: 'pipe' });
    } catch (err) {
      failures.push(`@yokailabs/tsconfig/${preset}: ${String(err.stdout).trim()}`);
    }
  }
} finally {
  rmSync(dir, { recursive: true, force: true });
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log('every config loads and lints clean');
