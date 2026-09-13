import type { Level, LevelContext } from './types.ts';

export type LevelFactory = () => Level;

export class LevelManager {
  private readonly factories: LevelFactory[];
  private readonly base: Omit<LevelContext, 'done'>;
  private current: Level | null = null;
  private index = -1;

  constructor(factories: LevelFactory[], base: Omit<LevelContext, 'done'>) {
    this.factories = factories;
    this.base = base;
  }

  get level(): number {
    return this.index + 1;
  }

  get finished(): boolean {
    return this.current === null && this.index >= this.factories.length;
  }

  start(at = 1): void {
    if (!Number.isInteger(at) || at < 1 || at > this.factories.length) {
      throw new RangeError(`level ${at} is outside 1..${this.factories.length}`);
    }
    this.enter(at - 1);
  }

  next(): void {
    this.current?.next();
  }

  update(dt: number): void {
    this.current?.update(dt);
  }

  private enter(i: number): void {
    this.current?.exit();
    this.current = null;
    this.index = i;
    if (i >= this.factories.length) return;
    const level = this.factories[i]!();
    this.current = level;
    level.enter({
      ...this.base,
      done: () => {
        if (this.current === level) this.enter(i + 1);
      },
    });
  }
}
