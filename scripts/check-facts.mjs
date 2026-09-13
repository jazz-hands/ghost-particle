#!/usr/bin/env node
// D-002, D-003: every F-ID used in src/ must exist in docs/FACTS.md, and the mirror must match the doc.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const [srcDir = 'src', factsDoc = 'docs/FACTS.md', mirror = 'src/content/facts.ts'] = process.argv.slice(2);

const documented = new Set([...readFileSync(factsDoc, 'utf8').matchAll(/^### (F-\d{2})\b/gm)].map((m) => m[1]));

const referenced = new Map();
for (const file of walk(srcDir)) {
  for (const m of readFileSync(file, 'utf8').matchAll(/\bF-\d{2}\b/g)) {
    if (!referenced.has(m[0])) referenced.set(m[0], file);
  }
}

const { FACTS } = await import(pathToFileURL(resolve(mirror)).href);
const mirrored = new Set(Object.keys(FACTS));

const problems = [];
for (const [id, file] of referenced) if (!documented.has(id)) problems.push(`${id} is referenced in ${file} but has no entry in ${factsDoc}`);
for (const id of documented) if (!mirrored.has(id)) problems.push(`${id} is in ${factsDoc} but missing from ${mirror}`);
for (const id of mirrored) if (!documented.has(id)) problems.push(`${id} is in ${mirror} but not in ${factsDoc}`);

if (problems.length > 0) {
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log(`check-facts: ${documented.size} facts documented, ${referenced.size} referenced in ${srcDir}, mirror in sync`);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}
