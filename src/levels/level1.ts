import type { Level } from './types.ts';

export function createLevel1(): Level {
  return {
    id: 1,
    enter() {},
    update() {},
    exit() {},
    next() {},
  };
}
