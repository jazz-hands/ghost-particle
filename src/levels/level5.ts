import type { Level, LevelContext } from './types.ts';

export function createLevel5(): Level {
  let ctx: LevelContext | null = null;
  return {
    id: 5,
    enter(c) { ctx = c; },
    update() {},
    exit() { ctx = null; },
    next() { ctx?.done(); },
  };
}
