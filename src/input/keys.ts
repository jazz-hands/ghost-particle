const PREVENTED = new Set(['Space', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']);

type Handler = () => void;

export class Keys {
  private readonly target: EventTarget;
  private readonly down = new Set<string>();
  private readonly presses = new Map<string, Set<Handler>>();
  private readonly releases = new Map<string, Set<Handler>>();

  private readonly keydown = (e: Event): void => {
    const code = (e as KeyboardEvent).code;
    if (PREVENTED.has(code)) e.preventDefault();
    if ((e as KeyboardEvent).repeat) return;
    this.handleDown(code);
  };

  private readonly keyup = (e: Event): void => {
    this.handleUp((e as KeyboardEvent).code);
  };

  constructor(target: EventTarget = window) {
    this.target = target;
    this.target.addEventListener('keydown', this.keydown);
    this.target.addEventListener('keyup', this.keyup);
  }

  isDown(code: string): boolean {
    return this.down.has(code);
  }

  onPress(code: string, fn: Handler): () => void {
    return subscribe(this.presses, code, fn);
  }

  onRelease(code: string, fn: Handler): () => void {
    return subscribe(this.releases, code, fn);
  }

  press(code: string): void {
    this.handleDown(code);
    this.handleUp(code);
  }

  dispose(): void {
    this.target.removeEventListener('keydown', this.keydown);
    this.target.removeEventListener('keyup', this.keyup);
    this.down.clear();
    this.presses.clear();
    this.releases.clear();
  }

  private handleDown(code: string): void {
    if (this.down.has(code)) return;
    this.down.add(code);
    fire(this.presses, code);
  }

  private handleUp(code: string): void {
    if (!this.down.delete(code)) return;
    fire(this.releases, code);
  }
}

function subscribe(map: Map<string, Set<Handler>>, code: string, fn: Handler): () => void {
  let set = map.get(code);
  if (!set) {
    set = new Set();
    map.set(code, set);
  }
  set.add(fn);
  return () => { set.delete(fn); };
}

function fire(map: Map<string, Set<Handler>>, code: string): void {
  for (const fn of [...(map.get(code) ?? [])]) fn();
}
