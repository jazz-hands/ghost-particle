import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseFlags } from '../../src/debug/flags.ts';

test('defaults to level 1 without debug', () => {
  assert.deepEqual(parseFlags('', 6), { level: 1, debug: false });
});

test('?level=N selects a level inside the range', () => {
  assert.equal(parseFlags('?level=3', 6).level, 3);
  assert.equal(parseFlags('?level=6', 6).level, 6);
});

test('out-of-range or non-numeric levels fall back to 1', () => {
  assert.equal(parseFlags('?level=0', 6).level, 1);
  assert.equal(parseFlags('?level=7', 6).level, 1);
  assert.equal(parseFlags('?level=2.5', 6).level, 1);
  assert.equal(parseFlags('?level=abc', 6).level, 1);
});

test('?debug turns debug on, with or without a value', () => {
  assert.equal(parseFlags('?debug', 6).debug, true);
  assert.equal(parseFlags('?debug=1&level=2', 6).debug, true);
});
