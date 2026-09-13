import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  BLIP_HZ, BLIP_PEAK, BUZZ_HZ, BUZZ_PEAK, THWIP_HZ, THWIP_PEAK,
  batchTickSpacing, bloomFrequency, bloomGain, buzzNotes, deepHumLevel, fieldHumLevel, humFrequency, humVolume,
  risingToneFrequency, sweepOffsets, swellFrequency, thwipPitch, tadaNotes, tickSeconds,
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

test('the pass-through blip stays high and cycles through its pitches', () => {
  for (let n = 0; n < 8; n += 1) {
    assert.ok(thwipPitch(n) >= 2000 && thwipPitch(n) <= 3200);
  }
  assert.equal(thwipPitch(4), thwipPitch(0));
  assert.notEqual(thwipPitch(1), thwipPitch(0));
});

test('the blip pitch is defined for negative and unusable counts', () => {
  assert.equal(thwipPitch(-4), thwipPitch(0));
  assert.equal(thwipPitch(Number.NaN), thwipPitch(0));
});

test('the rising tone climbs across the card and clamps at both ends', () => {
  assert.ok(risingToneFrequency(0) < risingToneFrequency(0.5));
  assert.ok(risingToneFrequency(0.5) < risingToneFrequency(1));
  assert.equal(risingToneFrequency(-1), risingToneFrequency(0));
  assert.equal(risingToneFrequency(2), risingToneFrequency(1));
});

test('the rising tone spans about an octave and a half', () => {
  const span = risingToneFrequency(1) / risingToneFrequency(0);
  assert.ok(span > 2 && span < 8);
});

test('the fanfare is three ascending notes, staggered, the last ringing on', () => {
  const notes = tadaNotes();
  assert.equal(notes.length, 3);
  for (let i = 1; i < notes.length; i += 1) {
    assert.ok(notes[i]!.hz > notes[i - 1]!.hz);
    assert.ok(notes[i]!.delay > notes[i - 1]!.delay);
  }
  assert.ok(notes[2]!.decay > notes[1]!.decay);
});

test('the wrong-answer buzz is gentle: lower and quieter than the UI confirm', () => {
  assert.ok(BUZZ_HZ < BLIP_HZ);
  assert.ok(BUZZ_PEAK < BLIP_PEAK);
});

test('the pass-through thwip is a tinier, higher blip', () => {
  assert.ok(THWIP_HZ > BLIP_HZ);
  assert.ok(THWIP_PEAK < BLIP_PEAK);
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

test('the field hum stays a bed: audible from the first dot, never near the charge hum', () => {
  assert.ok(fieldHumLevel(0) > 0);
  assert.ok(fieldHumLevel(0) < fieldHumLevel(1));
  assert.ok(fieldHumLevel(1) < 0.25);
});

test('the field hum clamps outside 0..1', () => {
  assert.equal(fieldHumLevel(-1), fieldHumLevel(0));
  assert.equal(fieldHumLevel(2), fieldHumLevel(1));
});

test('batch ticks tighten through the rush but never become a loop', () => {
  assert.ok(batchTickSpacing(0) > batchTickSpacing(1));
  for (const u of [-1, 0, 0.5, 1, 2]) assert.ok(batchTickSpacing(u) >= 0.25);
});

test('the bloom climbs an octave and a fifth', () => {
  assert.ok(bloomFrequency(0) < bloomFrequency(0.5));
  assert.ok(bloomFrequency(0.5) < bloomFrequency(1));
  assert.ok(Math.abs(bloomFrequency(1) / bloomFrequency(0) - 3) < 0.01);
});

test('the bloom holds back early and peaks with the light', () => {
  assert.ok(bloomGain(0) === 0);
  assert.ok(bloomGain(0.5) < bloomGain(1) * 0.3);
  assert.equal(bloomGain(2), bloomGain(1));
});
