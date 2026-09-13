import { test } from 'node:test';
import assert from 'node:assert/strict';
import { humFrequency, humVolume, risingToneFrequency, thwipPitch, tadaNotes, tickSeconds } from '../../src/audio/cues.ts';

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
