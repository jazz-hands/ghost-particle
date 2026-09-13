import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FIELD_DEGREES, SIGNAL_FRACTION, sampleEvent, seeded } from '../../src/content/skymap.ts';

test('every event lands inside the field', () => {
  const rand = seeded(7);
  for (let i = 0; i < 5000; i += 1) {
    const e = sampleEvent(rand);
    assert.ok(Math.abs(e.x) <= FIELD_DEGREES / 2 && Math.abs(e.y) <= FIELD_DEGREES / 2);
  }
});

test('signal events cluster near the centre, background does not', () => {
  const rand = seeded(11);
  let signal = 0;
  let signalNear = 0;
  let backgroundNear = 0;
  let background = 0;
  for (let i = 0; i < 20000; i += 1) {
    const e = sampleEvent(rand);
    const near = Math.hypot(e.x, e.y) < 15;
    if (e.signal) { signal += 1; if (near) signalNear += 1; } else { background += 1; if (near) backgroundNear += 1; }
  }
  assert.ok(Math.abs(signal / 20000 - SIGNAL_FRACTION) < 0.02);
  assert.ok(signalNear / signal > 0.4);
  assert.ok(backgroundNear / background < 0.12);
});

test('the same seed gives the same events', () => {
  const a = seeded(3);
  const b = seeded(3);
  for (let i = 0; i < 100; i += 1) assert.deepEqual(sampleEvent(a), sampleEvent(b));
});
