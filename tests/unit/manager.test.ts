import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LevelManager } from '../../src/levels/manager.ts';
import type { Level, LevelContext } from '../../src/levels/types.ts';

type Done = () => void;

function fakeLevel(id: number, log: string[], dones: Done[] = []): () => Level {
  return () => {
    let ctx: LevelContext | null = null;
    return {
      id,
      enter(c) { ctx = c; dones.push(c.done); log.push(`enter ${id}`); },
      update(dt) { log.push(`update ${id} ${dt}`); },
      exit() { log.push(`exit ${id}`); ctx = null; },
      next() { ctx?.done(); },
    };
  };
}

const base = {} as Omit<LevelContext, 'done'>;

test('start enters the first level', () => {
  const log: string[] = [];
  const m = new LevelManager([fakeLevel(1, log), fakeLevel(2, log)], base);
  m.start();
  assert.equal(m.level, 1);
  assert.equal(m.finished, false);
  assert.deepEqual(log, ['enter 1']);
});

test('start(at) jumps straight to that level', () => {
  const log: string[] = [];
  const m = new LevelManager([fakeLevel(1, log), fakeLevel(2, log), fakeLevel(3, log)], base);
  m.start(3);
  assert.equal(m.level, 3);
  assert.deepEqual(log, ['enter 3']);
});

test('done exits the current level and enters the next', () => {
  const log: string[] = [];
  const m = new LevelManager([fakeLevel(1, log), fakeLevel(2, log)], base);
  m.start();
  m.next();
  assert.equal(m.level, 2);
  assert.deepEqual(log, ['enter 1', 'exit 1', 'enter 2']);
});

test('update reaches only the current level', () => {
  const log: string[] = [];
  const m = new LevelManager([fakeLevel(1, log), fakeLevel(2, log)], base);
  m.update(0.5);
  assert.deepEqual(log, []);
  m.start();
  m.update(0.5);
  assert.deepEqual(log, ['enter 1', 'update 1 0.5']);
});

test('done after the last level marks the run finished', () => {
  const log: string[] = [];
  const m = new LevelManager([fakeLevel(1, log)], base);
  m.start();
  m.next();
  assert.equal(m.finished, true);
  assert.deepEqual(log, ['enter 1', 'exit 1']);
  m.update(1);
  m.next();
  assert.deepEqual(log, ['enter 1', 'exit 1']);
});

test('start rejects a level outside the range', () => {
  const log: string[] = [];
  const m = new LevelManager([fakeLevel(1, log), fakeLevel(2, log)], base);
  assert.throws(() => m.start(0), RangeError);
  assert.throws(() => m.start(3), RangeError);
  assert.throws(() => m.start(1.5), RangeError);
  assert.deepEqual(log, []);
  assert.equal(m.level, 0);
});

test('a stale done from an exited level is ignored', () => {
  const log: string[] = [];
  const dones: Done[] = [];
  const m = new LevelManager([fakeLevel(1, log, dones), fakeLevel(2, log, dones), fakeLevel(3, log, dones)], base);
  m.start();
  m.next();
  dones[0]!();
  assert.equal(m.level, 2);
  assert.deepEqual(log, ['enter 1', 'exit 1', 'enter 2']);
});

test('skip exits the current level and enters the next', () => {
  const log: string[] = [];
  const m = new LevelManager([fakeLevel(1, log), fakeLevel(2, log)], base);
  m.start();
  m.skip();
  assert.equal(m.level, 2);
  assert.deepEqual(log, ['enter 1', 'exit 1', 'enter 2']);
});

test('skip past the last level finishes the run', () => {
  const log: string[] = [];
  const m = new LevelManager([fakeLevel(1, log)], base);
  m.start();
  m.skip();
  assert.equal(m.finished, true);
  m.skip();
  assert.deepEqual(log, ['enter 1', 'exit 1']);
});

test('skip before start does nothing', () => {
  const log: string[] = [];
  const m = new LevelManager([fakeLevel(1, log)], base);
  m.skip();
  assert.equal(m.level, 0);
  assert.deepEqual(log, []);
});

test('onEnter reports each level as it is entered, not the end', () => {
  const log: string[] = [];
  const entered: number[] = [];
  const m = new LevelManager([fakeLevel(1, log), fakeLevel(2, log)], base, (level) => entered.push(level));
  m.start();
  m.next();
  m.next();
  assert.equal(m.finished, true);
  assert.deepEqual(entered, [1, 2]);
});
