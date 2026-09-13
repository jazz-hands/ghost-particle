export interface CardHost {
  card(text: string, facts?: string[], opts?: { small?: boolean }): Promise<void>;
  closeCard(): void;
}

// Reading time for a caption: cards are timed, Space only dismisses one early.
export function cardSeconds(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return 1 + 0.22 * words;
}

export interface PressHost {
  onPress(code: string, fn: () => void): () => void;
}

interface Step {
  tick(dt: number): void;
  off(): void;
  finish(): void;
}

const NEVER: Promise<void> = new Promise<void>(() => {});

// One beat at a time: update(dt) is the only clock, and next() resolves whatever is pending.
export class Beats {
  private readonly host: CardHost;
  private readonly keys: PressHost;
  private step: Step | null = null;
  private stopped = false;

  constructor(host: CardHost, keys: PressHost) {
    this.host = host;
    this.keys = keys;
  }

  get cancelled(): boolean {
    return this.stopped;
  }

  wait(seconds: number): Promise<void> {
    let left = seconds;
    return this.begin((finish) => ({
      tick: (dt) => {
        left -= dt;
        if (left <= 0) finish();
      },
    }));
  }

  until(pred: () => boolean): Promise<void> {
    return this.begin((finish) => ({
      tick: () => { if (pred()) finish(); },
    }));
  }

  card(text: string, facts?: string[], opts?: { small?: boolean; seconds?: number }): Promise<void> {
    return this.begin((finish) => {
      let live = true;
      let left = opts?.seconds ?? cardSeconds(text);
      void this.host.card(text, facts, { small: opts?.small }).then(() => { if (live) finish(); });
      return {
        tick: (dt) => {
          left -= dt;
          if (left <= 0 && live) this.host.closeCard();
        },
        off: () => { live = false; },
      };
    });
  }

  key(code: string): Promise<void> {
    return this.begin((finish) => ({ off: this.keys.onPress(code, finish) }));
  }

  next(): void {
    this.step?.finish();
  }

  cancel(): void {
    this.stopped = true;
    this.step?.off();
    this.step = null;
  }

  update(dt: number): void {
    this.step?.tick(dt);
  }

  private begin(make: (finish: () => void) => Partial<Step>): Promise<void> {
    if (this.stopped) return NEVER;
    this.step?.off();
    return new Promise<void>((resolve) => {
      const step: Step = {
        tick: () => {},
        off: () => {},
        finish: () => {
          if (this.step !== step) return;
          this.step = null;
          step.off();
          resolve();
        },
      };
      this.step = step;
      Object.assign(step, make(step.finish));
    });
  }
}
