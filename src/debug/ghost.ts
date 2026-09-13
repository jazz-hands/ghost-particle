import type { LevelManager } from '../levels/manager.ts';

export interface GhostHook {
  next(): void;
  readonly level: number;
  readonly finished: boolean;
}

declare global {
  interface Window { ghost: GhostHook }
}

export function installGhostHook(manager: LevelManager): void {
  window.ghost = {
    next: () => manager.next(),
    get level() { return manager.level; },
    get finished() { return manager.finished; },
  };
}
