export interface KeyPresser { down(code: string): void; up(code: string): void; }
export interface PointerLike { pointerId: number; clientX: number; target: unknown; preventDefault?(): void; }
export interface TouchRoot {
  addEventListener(type: string, fn: (e: PointerLike) => void): void;
  removeEventListener(type: string, fn: (e: PointerLike) => void): void;
  clientWidth: number;
  appendChild?(el: unknown): unknown;
}

const INTERACTIVE = '.hud-card, .hud-tile, button';

/** Turns pointer gestures on the HUD into the key codes the levels already listen for (D-030). */
export class Touch {
  private readonly keys: KeyPresser;
  private readonly root: TouchRoot;
  private readonly onGesture: () => void;
  private readonly held = new Map<number, string>();
  private codeFor: ((e: PointerLike) => string | null) | null = null;
  private affordance: { remove(): void } | null = null;

  private readonly down = (e: PointerLike): void => {
    if (!this.codeFor) return;
    // A tap on a card still unlocks audio even though it isn't a key press.
    this.onGesture();
    const target = e.target as { closest?(sel: string): unknown } | null;
    if (target?.closest?.(INTERACTIVE)) return;
    const code = this.codeFor(e);
    if (code === null || this.held.has(e.pointerId)) return;
    e.preventDefault?.();
    this.held.set(e.pointerId, code);
    this.keys.down(code);
  };

  private readonly up = (e: PointerLike): void => {
    // Touch pointers only count as an activating gesture on pointerup, not pointerdown.
    this.onGesture();
    const code = this.held.get(e.pointerId);
    if (code === undefined) return;
    this.held.delete(e.pointerId);
    // Two pointers can hold the same code; release only when the last one lifts.
    if (![...this.held.values()].includes(code)) this.keys.up(code);
  };

  constructor(keys: KeyPresser, root: TouchRoot, onGesture: () => void = () => {}) {
    this.keys = keys;
    this.root = root;
    this.onGesture = onGesture;
  }

  hold(code: string): void {
    this.clear();
    this.codeFor = () => code;
    this.listen();
  }

  halves(left: string, right: string): void {
    this.clear();
    this.codeFor = (e) => (e.clientX < this.root.clientWidth / 2 ? left : right);
    this.listen();
    this.affordance = arrows(this.root);
  }

  clear(): void {
    for (const code of new Set(this.held.values())) this.keys.up(code);
    this.held.clear();
    if (this.codeFor) {
      this.root.removeEventListener('pointerdown', this.down);
      this.root.removeEventListener('pointerup', this.up);
      this.root.removeEventListener('pointercancel', this.up);
    }
    this.codeFor = null;
    this.affordance?.remove();
    this.affordance = null;
  }

  private listen(): void {
    this.root.addEventListener('pointerdown', this.down);
    this.root.addEventListener('pointerup', this.up);
    this.root.addEventListener('pointercancel', this.up);
  }
}

function arrows(root: TouchRoot): { remove(): void } | null {
  if (typeof document !== 'object' || !root.appendChild) return null;
  const els = ['←', '→'].map((glyph, i) => {
    const el = document.createElement('div');
    el.className = `hud-touch-arrow hud-touch-arrow-${i === 0 ? 'left' : 'right'}`;
    el.textContent = glyph;
    root.appendChild!(el);
    return el;
  });
  return { remove: () => { for (const el of els) el.remove(); } };
}
