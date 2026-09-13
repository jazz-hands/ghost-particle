import { test } from 'node:test';
import assert from 'node:assert/strict';
import { humFrequency, humVolume, tickSeconds } from '../../src/audio/cues.ts';

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
