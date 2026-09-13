import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const script = join(process.cwd(), 'scripts/check-facts.mjs');

function fixture(opts: { docIds: string[]; mirrorIds: string[]; refs: string[] }) {
  const root = mkdtempSync(join(tmpdir(), 'check-facts-'));
  mkdirSync(join(root, 'src/content'), { recursive: true });
  writeFileSync(join(root, 'FACTS.md'), opts.docIds.map((id) => `### ${id} Title\n- Player wording: "x"\n`).join('\n'));
  writeFileSync(join(root, 'src/content/facts.ts'), `export const FACTS = { ${opts.mirrorIds.map((id) => `'${id}': { id: '${id}' }`).join(', ')} };\n`);
  writeFileSync(join(root, 'src/a.ts'), opts.refs.map((id) => `// ${id}\n`).join(''));
  return root;
}

function run(root: string) {
  try {
    const r = spawnSync('node', [script, join(root, 'src'), join(root, 'FACTS.md'), join(root, 'src/content/facts.ts')], { encoding: 'utf8' });
    return { code: r.status, out: r.stdout + r.stderr };
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

test('passes when every reference is documented and the mirror is in sync', () => {
  const r = run(fixture({ docIds: ['F-01', 'F-02'], mirrorIds: ['F-01', 'F-02'], refs: ['F-01'] }));
  assert.equal(r.code, 0, r.out);
});

test('fails on a reference with no entry in FACTS.md', () => {
  const r = run(fixture({ docIds: ['F-01'], mirrorIds: ['F-01'], refs: ['F-09'] }));
  assert.equal(r.code, 1);
  assert.match(r.out, /F-09/);
});

test('fails when the mirror lacks a documented fact', () => {
  const r = run(fixture({ docIds: ['F-01', 'F-02'], mirrorIds: ['F-01'], refs: [] }));
  assert.equal(r.code, 1);
  assert.match(r.out, /F-02/);
});

test('fails when the mirror has a fact the doc does not', () => {
  const r = run(fixture({ docIds: ['F-01'], mirrorIds: ['F-01', 'F-03'], refs: [] }));
  assert.equal(r.code, 1);
  assert.match(r.out, /F-03/);
});
