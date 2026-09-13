import { test } from 'node:test';
import assert from 'node:assert/strict';
import { portraitFov, DESKTOP_FOV } from '../../src/render/fov.ts';

test('wide screens keep the desktop fov', () => {
  assert.equal(portraitFov(16 / 9), DESKTOP_FOV);
  assert.equal(portraitFov(1.5), DESKTOP_FOV);
});

test('narrow screens widen the vertical fov to keep the horizontal view', () => {
  const fov34 = portraitFov(3 / 4);
  assert.ok(fov34 > DESKTOP_FOV && fov34 < 60, String(fov34));
  const hFov = (fov: number, aspect: number) => 2 * Math.atan(Math.tan((fov * Math.PI) / 360) * aspect);
  assert.ok(Math.abs(hFov(fov34, 3 / 4) - hFov(DESKTOP_FOV, 1.5)) < 1e-9);
});

test('very tall screens clamp at 60 degrees', () => {
  assert.equal(portraitFov(9 / 40), 60);
});
