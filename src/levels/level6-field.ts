import { sampleEvent, seeded } from '../content/skymap.ts';
import { TINTS } from '../content/flavors.ts';

// Level 6's field of arrivals: simulated event directions landing one at a time until the Sun
// stands out of the speckle (D-028, F-34). The pacing lives here; Hud.skymap draws it.

export const EVENTS = 9000;
export const MAP_SECONDS = 9;
export const GLOW_SECONDS = 2.5;
// Above 1 the fill opens as single arrivals and ends as a downpour. At 2.6 the last third of
// the fill carries four fifths of the map, so the Sun appears rather than fades up.
export const FILL_EXPONENT = 2.6;
// The rush is the stretch dense enough to read as one sheet of arrivals; the batch ticks and
// the hum's lift are measured against it.
export const RUSH_FROM = 0.55;
// 503 days is the exposure the map stands for (F-25); as a seed it keeps every run identical.
const SEED = 503;

export interface FieldDot { x: number; y: number; color: string }

export interface Fill {
  /** Advances the fill by dt and returns the arrivals that just landed. */
  advance(dt: number): FieldDot[];
  readonly done: boolean;
  /** Share of the map that has landed, 0 to 1. */
  readonly progress: number;
  /** How far into the rush, 0 before it and 1 at the end of the fill. */
  readonly rush: number;
}

/** The share of the map down a fraction u through the fill. */
export function fillFraction(u: number): number {
  return clamp01(u) ** FILL_EXPONENT;
}

export function createFill(): Fill {
  const rand = seeded(SEED);
  let elapsed = 0;
  let dropped = 0;
  return {
    advance(dt) {
      if (dropped >= EVENTS) return [];
      elapsed = Math.min(elapsed + dt, MAP_SECONDS);
      const target = Math.round(EVENTS * fillFraction(elapsed / MAP_SECONDS));
      const batch: FieldDot[] = [];
      for (; dropped < target; dropped += 1) {
        const e = sampleEvent(rand);
        batch.push({ x: e.x, y: e.y, color: TINTS[e.flavor] });
      }
      return batch;
    },
    get done() { return dropped >= EVENTS; },
    get progress() { return dropped / EVENTS; },
    get rush() { return clamp01((elapsed / MAP_SECONDS - RUSH_FROM) / (1 - RUSH_FROM)); },
  };
}

function clamp01(v: number): number {
  return Math.min(Math.max(v, 0), 1);
}
