import { Counter } from './counter.ts';
import type { Keys } from '../input/keys.ts';
import { TINTS } from '../content/flavors.ts';
import type { Flavor } from '../content/flavors.ts';

export interface GridTile { row: string; name: string; label: string }

export interface GridHandle {
  onPick(fn: (index: number) => void): void;
  show(row: string): void;
  wiggle(index: number, seconds: number): void;
  setLabel(index: number, label: string): void;
  mark(index: number): void;
  close(): void;
}

export interface ChartPoint { x: number; y: number; err: number }
export interface SkyMapHandle {
  drop(points: { x: number; y: number; color: string }[]): void;   // events in field degrees, centre (0, 0)
  glow(seconds: number): Promise<void>;                           // brightens the field into one light
  notes(visible: boolean): void;                                  // the simulated/credit lines under the field
  clearing(ndcX: number, ndcY: number, radius: number): void;     // soft hole so a 3D object shows through; radius as a fraction of height
  close(): void;
}

export interface ChartHandle {
  draw(seconds: number): Promise<void>;
  curve(fn: (x: number) => number, seconds: number): Promise<void>;
  close(): void;
}

const SVG = 'http://www.w3.org/2000/svg';

function div(className: string, parent?: HTMLElement): HTMLDivElement {
  const el = document.createElement('div');
  el.className = className;
  parent?.append(el);
  return el;
}

function svgEl<K extends keyof SVGElementTagNameMap>(tag: K, parent: SVGElement): SVGElementTagNameMap[K] {
  const el = document.createElementNS(SVG, tag);
  parent.append(el);
  return el;
}

function keyCode(key: string): string {
  return /^[a-z]$/i.test(key) ? `Key${key.toUpperCase()}` : key;
}

function ended(anim: Animation): Promise<void> {
  return anim.finished.then(() => undefined, () => undefined);
}

export class Hud {
  readonly counter: Counter;
  private readonly keys: Keys;
  private readonly layer: HTMLDivElement;
  private readonly slots = new Map<string, HTMLElement>();
  private readonly closers = new Set<() => void>();
  private cardEl: HTMLElement | null = null;
  private cardFinish: (() => void) | null = null;
  private fadeEl: HTMLElement | null = null;

  constructor(root: HTMLElement, keys: Keys) {
    this.keys = keys;
    this.layer = div('hud-layer', root);
    this.counter = new Counter(root);
  }

  get cardUp(): boolean {
    return this.cardEl !== null;
  }

  closeCard(): void {
    this.cardFinish?.();
  }

  card(text: string, facts?: string[], opts?: { small?: boolean }): Promise<void> {
    const box = this.buildCard('hud-card', text, facts, opts?.small === true);
    div('hud-card-hint', box).textContent = 'Space to continue';
    this.cardEl = box;
    return new Promise<void>((resolve) => {
      const finish = (): void => {
        if (this.cardEl !== box) return;
        this.cardEl = null;
        this.cardFinish = null;
        close();
        box.remove();
        resolve();
      };
      this.cardFinish = finish;
      const off = this.keys.onPress('Space', finish);
      box.addEventListener('click', finish);
      const close = (): void => {
        off();
        box.removeEventListener('click', finish);
        this.closers.delete(close);
      };
      this.closers.add(close);
    });
  }

  note(text: string | null, facts?: string[]): void {
    this.slots.get('note')?.remove();
    this.slots.delete('note');
    if (text === null) return;
    this.slots.set('note', this.buildCard('hud-card hud-note', text, facts, false));
  }

  prompt(text: string | null): void {
    this.text('prompt', 'hud-prompt', text);
  }

  title(text: string | null): void {
    this.text('title', 'hud-title', text);
  }

  readout(text: string | null): void {
    this.text('readout', 'hud-readout', text);
  }

  big(text: string, seconds: number): void {
    const el = div('hud-big', this.layer);
    el.textContent = text;
    void ended(el.animate([{ opacity: 0 }, { opacity: 1 }, { opacity: 1 }, { opacity: 0 }], {
      duration: Math.max(seconds, 0) * 1000,
      easing: 'linear',
    })).then(() => el.remove());
  }

  meter(fraction: number | null): void {
    if (fraction === null) {
      this.slots.get('meter')?.remove();
      this.slots.delete('meter');
      return;
    }
    let bar = this.slots.get('meter');
    if (!bar) {
      bar = div('hud-meter', this.layer);
      div('hud-meter-fill', bar);
      this.slots.set('meter', bar);
    }
    const fill = bar.firstElementChild as HTMLElement;
    fill.style.width = `${Math.min(Math.max(fraction, 0), 1) * 100}%`;
  }

  sub(lines: string[]): void {
    let box = this.slots.get('sub');
    if (!box) {
      box = div('hud-sub', this.layer);
      this.slots.set('sub', box);
    }
    box.replaceChildren(...lines.map((line) => {
      const row = document.createElement('div');
      row.textContent = line;
      return row;
    }));
  }

  flavor(f: Flavor | null): void {
    if (f === null) {
      this.slots.get('flavor')?.remove();
      this.slots.delete('flavor');
      return;
    }
    let icon = this.slots.get('flavor');
    if (!icon) {
      icon = div('hud-flavor', this.layer);
      this.slots.set('flavor', icon);
    }
    icon.textContent = f;
    icon.style.color = TINTS[f];
    icon.style.borderColor = TINTS[f];
  }

  flash(seconds: number): void {
    const el = div('hud-overlay hud-flash', this.layer);
    void ended(el.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: Math.max(seconds, 0) * 1000,
      easing: 'ease-out',
    })).then(() => el.remove());
  }

  fade(to: 0 | 1, seconds: number): Promise<void> {
    const el = this.fadeEl ?? div('hud-overlay hud-fade', this.layer);
    this.fadeEl = el;
    const from = Number(el.style.opacity === '' ? 0 : el.style.opacity);
    el.style.opacity = String(to);
    return ended(el.animate([{ opacity: from }, { opacity: to }], {
      duration: Math.max(seconds, 0) * 1000,
      easing: 'linear',
    })).then(() => {
      if (to === 0 && this.fadeEl === el) {
        this.fadeEl = null;
        el.remove();
      }
    });
  }

  grid(tiles: GridTile[], columns: number, opts?: { reveal?: boolean }): GridHandle {
    const box = div('hud-grid', this.layer);
    box.style.gridTemplateColumns = `repeat(${columns}, minmax(0, 1fr))`;
    const picks: ((index: number) => void)[] = [];
    let at = 0;

    const cells = tiles.map((tile, i) => {
      const cell = div('hud-tile', box);
      cell.dataset.row = tile.row;
      if (opts?.reveal) cell.hidden = true;
      div('hud-tile-name', cell).textContent = tile.name;
      div('hud-tile-label', cell).textContent = tile.label;
      cell.addEventListener('click', () => { move(i); pick(); });
      return cell;
    });

    const move = (i: number): void => {
      at = (i + cells.length) % cells.length;
      cells.forEach((cell, n) => cell.classList.toggle('hud-tile-on', n === at));
    };
    const pick = (): void => { for (const fn of [...picks]) fn(at); };
    const offs = [
      this.keys.onPress('ArrowLeft', () => move(at - 1)),
      this.keys.onPress('ArrowRight', () => move(at + 1)),
      this.keys.onPress('ArrowUp', () => move(at - columns)),
      this.keys.onPress('ArrowDown', () => move(at + columns)),
      this.keys.onPress('Space', pick),
    ];
    move(0);

    const close = (): void => {
      for (const off of offs) off();
      box.remove();
      this.closers.delete(close);
    };
    this.closers.add(close);

    return {
      onPick(fn) { picks.push(fn); },
      show(row) {
        for (const cell of cells) {
          if (cell.dataset.row !== row || !cell.hidden) continue;
          cell.hidden = false;
          cell.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 350 });
        }
      },
      wiggle: (index, seconds) => {
        const cell = cells[index];
        if (!cell) return;
        cell.classList.add('hud-tile-loud');
        void ended(cell.animate(
          [{ transform: 'translateX(0)' }, { transform: 'translateX(-4px)' }, { transform: 'translateX(4px)' }, { transform: 'translateX(0)' }],
          { duration: 220, iterations: Math.max(Math.round((seconds * 1000) / 220), 1) },
        )).then(() => cell.classList.remove('hud-tile-loud'));
      },
      setLabel(index, label) {
        const cell = cells[index];
        if (cell) (cell.lastElementChild as HTMLElement).textContent = label;
      },
      mark(index) { cells[index]?.classList.add('hud-tile-marked'); },
      close,
    };
  }

  buttons(items: { key: string; label: string }[], onPress: (key: string) => void): { close(): void } {
    const box = div('hud-buttons', this.layer);
    const offs: (() => void)[] = [];
    for (const item of items) {
      const button = document.createElement('button');
      button.className = 'hud-button';
      button.type = 'button';
      const kbd = document.createElement('kbd');
      kbd.textContent = item.key;
      button.append(kbd, document.createTextNode(` ${item.label}`));
      button.addEventListener('click', () => onPress(item.key));
      box.append(button);
      offs.push(this.keys.onPress(keyCode(item.key), () => onPress(item.key)));
    }
    const close = (): void => {
      for (const off of offs) off();
      box.remove();
      this.closers.delete(close);
    };
    this.closers.add(close);
    return { close };
  }

  reveal(text: string, seconds: number): void {
    const el = div('hud-reveal', this.layer);
    el.textContent = text;
    void ended(el.animate([{ opacity: 0 }, { opacity: 1 }, { opacity: 1 }, { opacity: 0 }], {
      duration: Math.max(seconds, 0) * 1000,
      easing: 'linear',
    })).then(() => el.remove());
  }

  // A 90° × 90° field: every event is one tiny tinted dot, drawn additively so the Sun builds
  // out of density (D-028). Landed dots accumulate on the back canvas; the front canvas is
  // cleared on every drop and carries only the newest arrivals' flare and the centre's wash,
  // so a dot flares as it lands and is at its tint by the next drop. glow() takes the whole
  // field up into one light.
  skymap(opts: { degrees: number; note: string; credit: string }): SkyMapHandle {
    // A dot at rest, and the wider, brighter stamp it lands as for one frame.
    const DOT_RADIUS = 1.5;
    const DOT_ALPHA = 0.62;
    const FLARE_RADIUS = 3.6;
    const FLARE_ALPHA = 0.85;
    // The centre's bloom: warm, wide and soft-edged, strengthening as arrivals pile up. The
    // curve is asymptotic, so it needs no total to aim at: 3000 arrivals reach two thirds.
    const WASH_DEGREES = 30;
    const WASH_RGB = '255, 206, 138';
    const WASH_PEAK = 0.3;
    const WASH_ARRIVALS = 3000;
    // The glow-up: the settled dots are lifted and pulled toward white, so the crowded centre
    // reads as gold-white while the sparse edges keep their tints.
    const GLOW_BRIGHTNESS = 2.2;
    const GLOW_SATURATE = 0.75;

    const box = div('hud-skymap', this.layer);
    const settled = document.createElement('canvas');
    const fresh = document.createElement('canvas');
    settled.className = 'hud-skymap-settled';
    fresh.className = 'hud-skymap-fresh';
    settled.width = fresh.width = innerWidth;
    settled.height = fresh.height = innerHeight;
    box.append(settled, fresh);
    const noteEl = div('hud-chart-note', box);
    noteEl.textContent = opts.note;
    const creditEl = div('hud-chart-credit', box);
    creditEl.textContent = opts.credit;

    const back = settled.getContext('2d');
    const front = fresh.getContext('2d');
    const scale = settled.width / opts.degrees;
    const half = opts.degrees / 2;
    const midX = settled.width / 2;
    const midY = settled.height / 2;
    // The beat sheet's reduced-motion rule, read the way render/rig.ts reads it: the arrival
    // flare goes, the fill itself is unchanged.
    const flares = !(typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches);

    const washRadius = WASH_DEGREES * scale;
    const wash = front?.createRadialGradient(midX, midY, 0, midX, midY, washRadius);
    wash?.addColorStop(0, `rgba(${WASH_RGB}, 1)`);
    wash?.addColorStop(0.35, `rgba(${WASH_RGB}, 0.42)`);
    wash?.addColorStop(1, `rgba(${WASH_RGB}, 0)`);
    let landed = 0;

    const stamp = (ctx: CanvasRenderingContext2D, points: { x: number; y: number; color: string }[], radius: number, alpha: number): void => {
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = alpha;
      for (const p of points) {
        const y = midY - p.y * scale;
        if (y < 0 || y > settled.height) continue;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc((p.x + half) * scale, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    };

    const close = (): void => {
      box.remove();
      this.closers.delete(close);
    };
    this.closers.add(close);
    return {
      drop(points) {
        if (!back) return;
        landed += points.length;
        stamp(back, points, DOT_RADIUS, DOT_ALPHA);
        if (!front) return;
        front.clearRect(0, 0, fresh.width, fresh.height);
        if (wash) {
          front.globalCompositeOperation = 'lighter';
          front.globalAlpha = WASH_PEAK * (1 - Math.exp(-landed / WASH_ARRIVALS));
          front.fillStyle = wash;
          front.fillRect(midX - washRadius, midY - washRadius, washRadius * 2, washRadius * 2);
          front.globalAlpha = 1;
          front.globalCompositeOperation = 'source-over';
        }
        if (flares) stamp(front, points, FLARE_RADIUS, FLARE_ALPHA);
      },
      notes(visible) {
        noteEl.hidden = !visible;
        creditEl.hidden = !visible;
      },
      clearing(ndcX, ndcY, radius) {
        const cx = ((ndcX + 1) / 2) * settled.width;
        const cy = ((1 - ndcY) / 2) * settled.height;
        const r = radius * settled.height;
        for (const ctx of [back, front]) {
          if (!ctx) continue;
          const hole = ctx.createRadialGradient(cx, cy, r * 0.7, cx, cy, r);
          hole.addColorStop(0, 'rgba(0, 0, 0, 1)');
          hole.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.globalCompositeOperation = 'destination-out';
          ctx.fillStyle = hole;
          ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
          ctx.globalCompositeOperation = 'source-over';
        }
      },
      glow(seconds) {
        const light = div('hud-skymap-glow', box);
        const ms = Math.max(seconds, 0) * 1000;
        const lift = { duration: ms, fill: 'forwards' as const, easing: 'ease-in-out' };
        const up = [{ filter: 'none' }, { filter: `brightness(${GLOW_BRIGHTNESS}) saturate(${GLOW_SATURATE})` }];
        settled.animate(up, lift);
        fresh.animate(up, lift);
        return ended(light.animate([{ opacity: 0 }, { opacity: 1 }], lift));
      },
      close,
    };
  }

  chart(points: ChartPoint[], opts: { xLabel: string; yLabel: string; credit: string; note: string }): ChartHandle {
    const box = div('hud-chart', this.layer);
    const svg = document.createElementNS(SVG, 'svg');
    svg.setAttribute('viewBox', '0 0 400 260');
    box.append(svg);

    const xs = points.map((p) => p.x);
    const ys = points.flatMap((p) => [p.y - p.err, p.y + p.err]);
    const xMin = Math.min(...xs);
    const xMax = Math.max(...xs);
    const yMin = Math.min(...ys, 0);
    const yMax = Math.max(...ys, 1);
    const px = (x: number): number => 50 + ((x - xMin) / (xMax - xMin || 1)) * 320;
    const py = (y: number): number => 210 - ((y - yMin) / (yMax - yMin || 1)) * 180;

    const axes = svgEl('path', svg);
    axes.setAttribute('class', 'hud-chart-axis');
    axes.setAttribute('d', `M50 30 V210 H370`);

    const dots = points.map((p) => {
      const g = svgEl('g', svg);
      g.setAttribute('class', 'hud-chart-point');
      g.style.opacity = '0';
      const bar = svgEl('line', g);
      bar.setAttribute('x1', String(px(p.x)));
      bar.setAttribute('x2', String(px(p.x)));
      bar.setAttribute('y1', String(py(p.y - p.err)));
      bar.setAttribute('y2', String(py(p.y + p.err)));
      const dot = svgEl('circle', g);
      dot.setAttribute('cx', String(px(p.x)));
      dot.setAttribute('cy', String(py(p.y)));
      dot.setAttribute('r', '3');
      return g;
    });

    const label = (text: string, x: number, y: number, cls: string, rotate = false): void => {
      const t = svgEl('text', svg);
      t.setAttribute('class', cls);
      t.setAttribute('x', String(x));
      t.setAttribute('y', String(y));
      if (rotate) {
        t.setAttribute('transform', `rotate(-90 ${x} ${y})`);
        t.setAttribute('text-anchor', 'middle');
      }
      t.textContent = text;
    };
    label(opts.xLabel, 210, 240, 'hud-chart-label');
    label(opts.yLabel, 18, 120, 'hud-chart-label', true);

    div('hud-chart-note', box).textContent = opts.note;
    div('hud-chart-credit', box).textContent = opts.credit;

    const close = (): void => {
      box.remove();
      this.closers.delete(close);
    };
    this.closers.add(close);

    return {
      draw(seconds) {
        const span = Math.max(seconds, 0) * 1000;
        const anims = dots.map((g, i) => {
          g.style.opacity = '1';
          return g.animate([{ opacity: 0 }, { opacity: 1 }], {
            duration: 150,
            delay: dots.length > 1 ? (i / (dots.length - 1)) * span : 0,
          });
        });
        return Promise.all(anims.map(ended)).then(() => undefined);
      },
      curve(fn, seconds) {
        const path = svgEl('path', svg);
        path.setAttribute('class', 'hud-chart-curve');
        const steps = 48;
        const d = Array.from({ length: steps + 1 }, (_, i) => {
          const x = xMin + ((xMax - xMin) * i) / steps;
          return `${i === 0 ? 'M' : 'L'}${px(x)} ${py(fn(x))}`;
        }).join(' ');
        path.setAttribute('d', d);
        const length = path.getTotalLength();
        path.style.strokeDasharray = String(length);
        return ended(path.animate(
          [{ strokeDashoffset: length }, { strokeDashoffset: 0 }],
          { duration: Math.max(seconds, 0) * 1000, fill: 'forwards' },
        ));
      },
      close,
    };
  }

  credits(lines: string[], onPlayAgain: () => void, byline?: string): { close(): void } {
    // A line marked with a leading '## ' is a section heading, not a credit.
    const HEAD = '## ';
    // The roll, in pixels a second: slow enough to read. It only nudges a real scroll box
    // along, so the wheel can take it over or run ahead of it at any point.
    const ROLL_PER_SECOND = 26;

    const box = div('hud-credits', this.layer);
    const scroll = div('hud-credits-scroll', box);
    for (const line of lines) {
      const head = line.startsWith(HEAD);
      div(head ? 'hud-credits-head' : 'hud-credits-line', scroll).textContent = head ? line.slice(HEAD.length) : line;
    }
    const button = document.createElement('button');
    button.className = 'hud-button hud-play-again hud-credits-play';
    button.type = 'button';
    button.textContent = 'Play again';
    button.addEventListener('click', onPlayAgain);
    box.append(button);
    if (byline) div('hud-credits-byline', box).textContent = byline;

    let raf = 0;
    let carry = 0;
    let last = performance.now();
    const roll = (now: number): void => {
      carry += Math.min((now - last) / 1000, 0.25) * ROLL_PER_SECOND;
      last = now;
      const step = Math.floor(carry);
      if (step >= 1) {
        carry -= step;
        scroll.scrollTop += step;
      }
      raf = scroll.scrollTop < scroll.scrollHeight - scroll.clientHeight ? requestAnimationFrame(roll) : 0;
    };
    raf = requestAnimationFrame(roll);

    const close = (): void => {
      if (raf !== 0) cancelAnimationFrame(raf);
      box.remove();
      this.closers.delete(close);
    };
    this.closers.add(close);
    return { close };
  }

  clear(): void {
    for (const close of [...this.closers]) close();
    this.closers.clear();
    this.slots.clear();
    this.cardEl = null;
    this.fadeEl = null;
    this.layer.replaceChildren();
  }

  private buildCard(className: string, text: string, facts: string[] | undefined, small: boolean): HTMLDivElement {
    const box = div(small ? `${className} hud-card-small` : className, this.layer);
    div('hud-card-text', box).textContent = text;
    void facts;
    return box;
  }

  private text(slot: string, className: string, value: string | null): void {
    if (value === null) {
      this.slots.get(slot)?.remove();
      this.slots.delete(slot);
      return;
    }
    let el = this.slots.get(slot);
    if (!el) {
      el = div(className, this.layer);
      this.slots.set(slot, el);
    }
    el.textContent = value;
  }
}
