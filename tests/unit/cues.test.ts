import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  BLIP_HZ, BLIP_PEAK, BUZZ_HZ, BUZZ_PEAK, THWIP_HZ, THWIP_PEAK,
  humFrequency, humVolume, tadaDelay, tadaHz, tickSeconds,
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

test('the fanfare is three notes, rising to an octave over its root', () => {
  assert.ok(tadaHz(0) < tadaHz(1));
  assert.ok(tadaHz(1) < tadaHz(2));
  assert.ok(Math.abs(tadaHz(2) - tadaHz(0) * 2) < 0.001);
});

test('the fanfare plays its notes one after another, and clamps to the three', () => {
  assert.equal(tadaDelay(0), 0);
  assert.ok(tadaDelay(1) > tadaDelay(0));
  assert.ok(tadaDelay(2) > tadaDelay(1));
  assert.equal(tadaDelay(9), tadaDelay(2));
  assert.equal(tadaHz(-3), tadaHz(0));
});

test('the wrong-answer buzz is gentle: lower and quieter than the UI confirm', () => {
  assert.ok(BUZZ_HZ < BLIP_HZ);
  assert.ok(BUZZ_PEAK < BLIP_PEAK);
});

test('the pass-through thwip is a tinier, higher blip', () => {
  assert.ok(THWIP_HZ > BLIP_HZ);
  assert.ok(THWIP_PEAK < BLIP_PEAK);
});
