import type { Level } from './types.ts';

export function createLevel2(): Level {
  return {
    id: 2,
    enter() {},
    update() {},
    exit() {},
    next() {},
  };
}
