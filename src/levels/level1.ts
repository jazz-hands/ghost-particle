import type { Level, LevelContext } from './types.ts';

export function createLevel1(): Level {
  let ctx: LevelContext | null = null;
  return {
    id: 1,
    enter(c) { ctx = c; },
    update() {},
    exit() { ctx = null; },
    next() { ctx?.done(); },
  };
}
