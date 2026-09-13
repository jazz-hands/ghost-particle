// F-32: neutrinos through the player since start, at the planning rate Φ (F-07) × A.
export const RATE_PER_SECOND = 6e10 * 5400;

const SCALES: { value: number; word: string }[] = [
  { value: 1e18, word: 'quintillion' },
  { value: 1e15, word: 'quadrillion' },
  { value: 1e12, word: 'trillion' },
  { value: 1e9, word: 'billion' },
  { value: 1e6, word: 'million' },
  { value: 1e3, word: 'thousand' },
];

const PAINT_INTERVAL = 0.1;

export function formatCount(n: number): string {
  const scale = SCALES.find((s) => n >= s.value);
  if (!scale) return `about ${round(n)}`;
  return `about ${round(n / scale.value)} ${scale.word}`;
}

function round(n: number): string {
  return String(Number(n.toPrecision(3)));
}

export class Counter {
  private readonly el: HTMLDivElement;
  private readonly text: HTMLSpanElement;
  private startedAt: number | null = null;
  private stoppedAt: number | null = null;
  private painted = -Infinity;
  private shown = '';

  constructor(root: HTMLElement) {
    this.el = document.createElement('div');
    this.el.className = 'hud-counter';
    this.el.hidden = true;
    this.el.append(document.createTextNode('Neutrinos through you since you started: '));
    this.text = document.createElement('span');
    this.text.className = 'hud-counter-value';
    this.el.append(this.text);
    root.append(this.el);
  }

  get running(): boolean {
    return this.startedAt !== null && this.stoppedAt === null;
  }

  start(): void {
    if (this.startedAt !== null) return;
    this.startedAt = performance.now() / 1000;
    this.paint(true);
  }

  stop(): void {
    if (this.startedAt === null || this.stoppedAt !== null) return;
    this.stoppedAt = performance.now() / 1000;
    this.paint(true);
  }

  value(): number {
    if (this.startedAt === null) return 0;
    const end = this.stoppedAt ?? performance.now() / 1000;
    return RATE_PER_SECOND * (end - this.startedAt);
  }

  setVisible(v: boolean): void {
    this.el.hidden = !v;
    if (v) this.paint(true);
  }

  freezeLarge(): void {
    this.stop();
    this.el.classList.add('hud-counter-large');
  }

  update(): void {
    this.paint(false);
  }

  private paint(force: boolean): void {
    const now = performance.now() / 1000;
    if (!force && now - this.painted < PAINT_INTERVAL) return;
    this.painted = now;
    const next = formatCount(this.value());
    if (next === this.shown) return;
    this.shown = next;
    this.text.textContent = next;
  }
}
