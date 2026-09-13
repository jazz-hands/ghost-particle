import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatCount, RATE_PER_SECOND } from '../../src/hud/counter.ts';

test('the planning rate is the flux times the reference area', () => {
  assert.equal(RATE_PER_SECOND, 6e10 * 5400);
});

test('formats a count with three significant figures and a word scale', () => {
  assert.equal(formatCount(3.2e14), 'about 320 trillion');
  assert.equal(formatCount(1.9e17), 'about 190 quadrillion');
});

test('leaves small counts unscaled', () => {
  assert.equal(formatCount(0), 'about 0');
  assert.equal(formatCount(999), 'about 999');
});

test('uses every scale from thousand to quintillion', () => {
  assert.equal(formatCount(1000), 'about 1 thousand');
  assert.equal(formatCount(2.5e6), 'about 2.5 million');
  assert.equal(formatCount(1.23e9), 'about 1.23 billion');
  assert.equal(formatCount(4e18), 'about 4 quintillion');
  assert.equal(formatCount(4e21), 'about 4000 quintillion');
});
