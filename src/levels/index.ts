import type { LevelFactory } from './manager.ts';
import { createLevel1 } from './level1.ts';
import { createLevel2 } from './level2.ts';
import { createLevel3 } from './level3.ts';
import { createLevel4 } from './level4.ts';
import { createLevel5 } from './level5.ts';
import { createLevel6 } from './level6.ts';

export const LEVELS: LevelFactory[] = [
  createLevel1, createLevel2, createLevel3, createLevel4, createLevel5, createLevel6,
];
