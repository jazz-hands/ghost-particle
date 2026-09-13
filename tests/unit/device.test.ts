import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isTouch } from '../../src/input/device.ts';

test('isTouch is false where matchMedia does not exist', () => {
  assert.equal(isTouch(), false);
});

test('isTouch follows the coarse-pointer media query', () => {
  const g = globalThis as { matchMedia?: (q: string) => { matches: boolean } };
  g.matchMedia = (q) => ({ matches: q === '(pointer: coarse)' });
  try {
    assert.equal(isTouch(), true);
  } finally {
    delete g.matchMedia;
  }
});
