import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Touch, type PointerLike, type TouchRoot } from '../../src/input/touch.ts';

class FakeRoot implements TouchRoot {
  clientWidth = 400;
  private readonly fns = new Map<string, Set<(e: PointerLike) => void>>();
  addEventListener(type: string, fn: (e: PointerLike) => void): void {
    (this.fns.get(type) ?? this.fns.set(type, new Set()).get(type)!).add(fn);
  }
  removeEventListener(type: string, fn: (e: PointerLike) => void): void {
    this.fns.get(type)?.delete(fn);
  }
  emit(type: string, e: Partial<PointerLike>): void {
    for (const fn of this.fns.get(type) ?? []) fn({ pointerId: 1, clientX: 0, target: null, ...e });
  }
  count(): number {
    let n = 0;
    for (const set of this.fns.values()) n += set.size;
    return n;
  }
}

function setup(): { root: FakeRoot; log: string[]; touch: Touch; gestures: number } {
  const root = new FakeRoot();
  const log: string[] = [];
  const state = { gestures: 0 };
  const keys = { down: (c: string) => log.push(`down ${c}`), up: (c: string) => log.push(`up ${c}`) };
  const touch = new Touch(keys, root, () => { state.gestures += 1; });
  return { root, log, touch, get gestures() { return state.gestures; } };
}

test('hold presses the code on pointerdown and releases on pointerup', () => {
  const s = setup();
  s.touch.hold('Space');
  s.root.emit('pointerdown', { pointerId: 7 });
  s.root.emit('pointerup', { pointerId: 7 });
  assert.deepEqual(s.log, ['down Space', 'up Space']);
  assert.equal(s.gestures, 1);
});

test('hold ignores pointers that start on a card, tile or button', () => {
  const s = setup();
  s.touch.hold('Space');
  const target = { closest: (sel: string) => (sel.includes('.hud-card') ? {} : null) };
  s.root.emit('pointerdown', { target });
  assert.deepEqual(s.log, []);
});

test('halves maps left and right by x and tracks two pointers', () => {
  const s = setup();
  s.touch.halves('ArrowLeft', 'ArrowRight');
  s.root.emit('pointerdown', { pointerId: 1, clientX: 50 });
  s.root.emit('pointerdown', { pointerId: 2, clientX: 350 });
  s.root.emit('pointerup', { pointerId: 1 });
  s.root.emit('pointercancel', { pointerId: 2 });
  assert.deepEqual(s.log, ['down ArrowLeft', 'down ArrowRight', 'up ArrowLeft', 'up ArrowRight']);
});

test('clear releases held codes and detaches listeners', () => {
  const s = setup();
  s.touch.hold('Space');
  s.root.emit('pointerdown', { pointerId: 3 });
  s.touch.clear();
  assert.deepEqual(s.log, ['down Space', 'up Space']);
  assert.equal(s.root.count(), 0);
});

test('declaring a new region clears the previous one', () => {
  const s = setup();
  s.touch.hold('Space');
  s.touch.halves('ArrowLeft', 'ArrowRight');
  s.root.emit('pointerdown', { pointerId: 1, clientX: 10 });
  assert.deepEqual(s.log, ['down ArrowLeft']);
});
