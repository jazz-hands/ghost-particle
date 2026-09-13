import type { Level, LevelContext } from './types.ts';

export function createLevel3(): Level {
  let ctx: LevelContext | null = null;
  return {
    id: 3,
    enter(c) { ctx = c; },
    update() {},
    exit() { ctx = null; },
    next() { ctx?.done(); },
  };
}
