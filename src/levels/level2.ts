import type { Level, LevelContext } from './types.ts';

export function createLevel2(): Level {
  let ctx: LevelContext | null = null;
  return {
    id: 2,
    enter(c) { ctx = c; },
    update() {},
    exit() { ctx = null; },
    next() { ctx?.done(); },
  };
}
