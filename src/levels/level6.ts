import type { Level, LevelContext } from './types.ts';

export function createLevel6(): Level {
  let ctx: LevelContext | null = null;
  return {
    id: 6,
    enter(c) { ctx = c; },
    update() {},
    exit() { ctx = null; },
    next() { ctx?.done(); },
  };
}
