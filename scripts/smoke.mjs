// Uses every published config the way a consumer would, so a dependency bump that breaks a
// plugin, renames a rule or drops an export fails here rather than in the first repo to upgrade.
// These packages have no code of their own to unit test; this is their test.
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
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

  // The base preset reports a runtime import cycle, and passes the same two files once one edge is
  // `import type`. A cycle needs real files for the resolver to follow, so these are linted from
  // disk. One edge names `./b.js` for `b.ts`, which only the TypeScript resolver maps.
  const cycleA = "import { b } from './b.js';\n\nexport type A = number;\nexport const a: A = b;\n";
  for (const [fixture, cycleB, expected] of [
    ['runtime', "import { a } from './a.ts';\n\nexport const b = 1;\nexport const c = a;\n", 2],
    ['type', "import type { A } from './a.ts';\n\nexport const b: A = 1;\n", 0],
  ]) {
    const name = `@yokailabs/eslint-config/base import cycle (${fixture})`;
    const sub = join(dir, `cycle-${fixture}`);
    mkdirSync(sub);
    writeFileSync(join(sub, 'a.ts'), cycleA);
    writeFileSync(join(sub, 'b.ts'), cycleB);
    try {
      const { ESLint } = await import('eslint');
      const { default: config } = await import('@yokailabs/eslint-config/base');
      const eslint = new ESLint({ overrideConfigFile: true, overrideConfig: config });
      const messages = (await eslint.lintFiles([sub])).flatMap((r) => r.messages);
      const cycles = messages.filter((m) => m.ruleId === 'import-x/no-cycle').length;
      if (cycles !== expected || messages.length !== expected) {
        const got = messages.map((m) => `${m.ruleId}: ${m.message}`).join('; ') || 'no messages';
        failures.push(`${name}: expected ${expected} import-x/no-cycle errors, got ${got}`);
      }
    } catch (err) {
      failures.push(`${name}: ${err.message}`);
    }
  }

  // A cycle through `@/` aliases is reported when the paths sit in a tsconfig two references below
  // the root one, as in a Vite app. The resolver finds tsconfigs from the directory lint runs in,
  // and only once, so this lints as a consumer does: `eslint .` run from the project's own root.
  const alias = join(dir, 'cycle-alias');
  const web = join(alias, 'apps', 'web');
  mkdirSync(join(web, 'src'), { recursive: true });
  writeFileSync(join(alias, 'eslint.config.js'), "export { default } from '@yokailabs/eslint-config/base';\n");
  writeFileSync(join(alias, 'tsconfig.json'), JSON.stringify({ files: [], references: [{ path: './apps/web' }] }));
  writeFileSync(
    join(web, 'tsconfig.json'),
    JSON.stringify({ files: [], references: [{ path: './tsconfig.app.json' }] }),
  );
  writeFileSync(
    join(web, 'tsconfig.app.json'),
    JSON.stringify({ compilerOptions: { paths: { '@/*': ['./src/*'] } }, include: ['src'] }),
  );
  writeFileSync(join(web, 'src', 'a.ts'), "import { b } from '@/b';\n\nexport const a = 1;\nexport const c = b;\n");
  writeFileSync(join(web, 'src', 'b.ts'), "import { a } from '@/a';\n\nexport const b = 1;\nexport const d = a;\n");
  const aliasName = '@yokailabs/eslint-config/base import cycle (alias in a referenced tsconfig)';
  let report;
  try {
    report = execFileSync('npx', ['eslint', '--format', 'json', '.'], { cwd: alias, stdio: 'pipe' });
  } catch (err) {
    report = err.stdout;
  }
  try {
    const messages = JSON.parse(String(report)).flatMap((r) => r.messages);
    const cycles = messages.filter((m) => m.ruleId === 'import-x/no-cycle').length;
    if (cycles !== 2 || messages.length !== 2) {
      const got = messages.map((m) => `${m.ruleId}: ${m.message}`).join('; ') || 'no messages';
      failures.push(`${aliasName}: expected 2 import-x/no-cycle errors, got ${got}`);
    }
  } catch (err) {
    failures.push(`${aliasName}: ${err.message}\n${String(report).trim()}`);
  }
} finally {
  rmSync(dir, { recursive: true, force: true });
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log('every config loads and lints clean');
