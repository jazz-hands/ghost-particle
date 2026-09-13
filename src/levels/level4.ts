import type { Level, LevelContext } from './types.ts';

export function createLevel4(): Level {
  let ctx: LevelContext | null = null;
  return {
    id: 4,
    enter(c) { ctx = c; },
    update() {},
    exit() { ctx = null; },
    next() { ctx?.done(); },
  };
}
