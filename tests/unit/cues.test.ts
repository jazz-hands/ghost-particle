import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buzzNotes, deepHumLevel, humFrequency, humVolume, sweepOffsets, swellFrequency, tickSeconds,
} from '../../src/audio/cues.ts';

test('the hum rises in pitch across the hold', () => {
  assert.ok(humFrequency(0) < humFrequency(0.5));
  assert.ok(humFrequency(0.5) < humFrequency(1));
});

test('the hum clamps outside 0..1', () => {
  assert.equal(humFrequency(-1), humFrequency(0));
  assert.equal(humFrequency(2), humFrequency(1));
  assert.equal(humVolume(2), humVolume(1));
});

test('level 0 is silence, and any hold is audible at once', () => {
  assert.equal(humVolume(0), 0);
  assert.ok(humVolume(0.001) > humVolume(1) * 0.25);
});

test('the hum grows louder with the charge', () => {
  assert.ok(humVolume(0.5) < humVolume(1));
});

test('the counter ticks about twice a second by default', () => {
  assert.equal(tickSeconds(1), 0.5);
});

test('a faster rate tightens the tick, down to a floor', () => {
  assert.ok(tickSeconds(4) < tickSeconds(1));
  assert.ok(tickSeconds(1000) >= 0.06);
});

test('a rate that is not a positive number falls back to the base pace', () => {
  assert.equal(tickSeconds(0), tickSeconds(1));
  assert.equal(tickSeconds(-2), tickSeconds(1));
  assert.equal(tickSeconds(Number.NaN), tickSeconds(1));
});

test('the deep hum swells from silence and settles back to it', () => {
  assert.equal(deepHumLevel(0), 0);
  assert.equal(deepHumLevel(1), 0);
  assert.ok(deepHumLevel(0.2) > 0);
  assert.ok(deepHumLevel(0.35) > deepHumLevel(0.2));
  assert.ok(deepHumLevel(0.9) < deepHumLevel(0.6));
});

test('the deep hum clamps outside its own length', () => {
  assert.equal(deepHumLevel(-1), deepHumLevel(0));
  assert.equal(deepHumLevel(2), deepHumLevel(1));
});

test('a tick sweep is single ticks spread across its seconds', () => {
  const offsets = sweepOffsets(6, 3);
  assert.equal(offsets.length, 6);
  assert.equal(offsets[0], 0);
  assert.ok(offsets.every((v, i) => i === 0 || v > offsets[i - 1]!));
  assert.ok(offsets.at(-1)! < 3);
});

test('a sweep of nothing still ticks once, and never before it starts', () => {
  assert.deepEqual(sweepOffsets(0, 3), [0]);
  assert.deepEqual(sweepOffsets(1, -2), [0]);
});

test('the swell opens its filter all the way, and only upward', () => {
  assert.ok(swellFrequency(0) < swellFrequency(0.5));
  assert.ok(swellFrequency(0.5) < swellFrequency(1));
  assert.equal(swellFrequency(2), swellFrequency(1));
  assert.equal(swellFrequency(-1), swellFrequency(0));
});

test('the swell spends its first half low, so the peak is the event', () => {
  const span = swellFrequency(1) - swellFrequency(0);
  assert.ok(swellFrequency(0.5) - swellFrequency(0) < span * 0.3);
});

test('the wrong answer falls rather than rises', () => {
  const [first, second] = buzzNotes();
  assert.ok(second < first);
  assert.ok(second > first * 0.5);
});
