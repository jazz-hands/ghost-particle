import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pingPath } from '../../src/telemetry/ping.ts';

test('a ping path carries the event and whole seconds of play time', () => {
  assert.equal(pingPath('level/3', 92.7), '/ping/level/3?s=92');
  assert.equal(pingPath('finished', 411.2), '/ping/finished?s=411');
});

test('play time never goes below zero', () => {
  assert.equal(pingPath('level/1', -0.4), '/ping/level/1?s=0');
});
