import type { Level } from './types.ts';

export function createLevel5(): Level {
  return {
    id: 5,
    enter() {},
    update() {},
    exit() {},
    next() {},
  };
}
