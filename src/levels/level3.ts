import type { Level } from './types.ts';

export function createLevel3(): Level {
  return {
    id: 3,
    enter() {},
    update() {},
    exit() {},
    next() {},
  };
}
