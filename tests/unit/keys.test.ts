import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Keys } from '../../src/input/keys.ts';

test('down and up fire press and release once and track isDown', () => {
  const keys = new Keys(new EventTarget());
  const log: string[] = [];
  keys.onPress('Space', () => log.push('press'));
  keys.onRelease('Space', () => log.push('release'));
  keys.down('Space');
  keys.down('Space');
  assert.equal(keys.isDown('Space'), true);
  keys.up('Space');
  keys.up('Space');
  assert.equal(keys.isDown('Space'), false);
  assert.deepEqual(log, ['press', 'release']);
  keys.dispose();
});
