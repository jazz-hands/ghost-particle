import type { Level } from './types.ts';

export function createLevel4(): Level {
  return {
    id: 4,
    enter() {},
    update() {},
    exit() {},
    next() {},
  };
}
