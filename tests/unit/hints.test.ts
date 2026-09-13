import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hint, HINT_IDS } from '../../src/hud/hints.ts';

function withTouch<T>(on: boolean, fn: () => T): T {
  const g = globalThis as { matchMedia?: (q: string) => { matches: boolean } };
  g.matchMedia = () => ({ matches: on });
  try { return fn(); } finally { delete g.matchMedia; }
}

test('keyboard phrasing is the desktop wording', () => {
  withTouch(false, () => {
    assert.equal(hint('hold'), 'Hold Space');
    assert.equal(hint('continue'), 'Space to continue');
    assert.equal(hint('steer'), 'Arrow keys to steer');
    assert.equal(hint('pick'), 'Arrow keys to move, Space to pick.');
    assert.equal(hint('sort'), 'Press E for an electron, M for a muon.');
  });
});

test('touch phrasing never names a key', () => {
  withTouch(true, () => {
    for (const id of HINT_IDS) {
      const text = hint(id);
      assert.doesNotMatch(text, /Space|Arrow|Press E/i, id);
    }
    assert.equal(hint('continue'), 'Tap to continue');
    assert.equal(hint('steer'), 'Hold left or right to steer');
  });
});
