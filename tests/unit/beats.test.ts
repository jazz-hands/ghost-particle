import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Beats, cardSeconds } from '../../src/levels/beats.ts';

type Resolver = () => void;

function host() {
  const cards: string[] = [];
  const resolvers: Resolver[] = [];
  return {
    cards,
    resolvers,
    card(text: string) {
      cards.push(text);
      return new Promise<void>((resolve) => { resolvers.push(resolve); });
    },
    closeCard() {
      resolvers.pop()?.();
    },
  };
}

function pressHost() {
  const listeners = new Map<string, Set<() => void>>();
  return {
    onPress(code: string, fn: () => void) {
      const set = listeners.get(code) ?? new Set<() => void>();
      listeners.set(code, set);
      set.add(fn);
      return () => { set.delete(fn); };
    },
    fire(code: string) {
      for (const fn of [...(listeners.get(code) ?? [])]) fn();
    },
    count(code: string) {
      return listeners.get(code)?.size ?? 0;
    },
  };
}

function settled(p: Promise<void>): () => boolean {
  let done = false;
  void p.then(() => { done = true; });
  return () => done;
}

const tick = () => new Promise<void>((r) => { setTimeout(r, 0); });

test('wait resolves once update() has accumulated the seconds', async () => {
  const b = new Beats(host(), pressHost());
  const done = settled(b.wait(1));
  b.update(0.4);
  b.update(0.4);
  await tick();
  assert.equal(done(), false);
  b.update(0.2);
  await tick();
  assert.equal(done(), true);
});

test('next() resolves a pending wait early', async () => {
  const b = new Beats(host(), pressHost());
  const done = settled(b.wait(10));
  b.update(0.1);
  b.next();
  await tick();
  assert.equal(done(), true);
});

test('until() is checked on each update and next() resolves it early', async () => {
  const b = new Beats(host(), pressHost());
  let ready = false;
  const first = settled(b.until(() => ready));
  b.update(0.1);
  await tick();
  assert.equal(first(), false);
  ready = true;
  b.update(0.1);
  await tick();
  assert.equal(first(), true);

  const second = settled(b.until(() => false));
  b.next();
  await tick();
  assert.equal(second(), true);
});

test('card resolves when the host card resolves, and next() resolves it early', async () => {
  const h = host();
  const b = new Beats(h, pressHost());
  const first = settled(b.card('one', ['F-01']));
  assert.deepEqual(h.cards, ['one']);
  await tick();
  assert.equal(first(), false);
  h.resolvers[0]!();
  await tick();
  assert.equal(first(), true);

  const second = settled(b.card('two'));
  b.next();
  await tick();
  assert.equal(second(), true);
});

test('a card closes on its own after its reading time', async () => {
  const h = host();
  const b = new Beats(h, pressHost());
  const text = 'one two three four five';
  const done = settled(b.card(text));
  assert.equal(cardSeconds(text), 2.1);
  b.update(2);
  await tick();
  assert.equal(done(), false);
  b.update(0.2);
  await tick();
  assert.equal(done(), true);
  assert.equal(h.resolvers.length, 0);
});

test('key resolves on that key and unsubscribes afterwards', async () => {
  const keys = pressHost();
  const b = new Beats(host(), keys);
  const done = settled(b.key('Space'));
  assert.equal(keys.count('Space'), 1);
  keys.fire('Space');
  await tick();
  assert.equal(done(), true);
  assert.equal(keys.count('Space'), 0);
});

test('after cancel() nothing resolves, pending or future', async () => {
  const keys = pressHost();
  const b = new Beats(host(), keys);
  const pending = settled(b.wait(1));
  b.cancel();
  assert.equal(b.cancelled, true);
  b.update(5);
  b.next();
  await tick();
  assert.equal(pending(), false);

  const later = settled(b.wait(0.1));
  b.update(5);
  b.next();
  await tick();
  assert.equal(later(), false);
  assert.equal(keys.count('Space'), 0);
});
