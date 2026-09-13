import type { Flavor } from './flavors.ts';

// F-34: simulated solar-neutrino event directions on a 90° × 90° field centred on the Sun.
// Signal events cluster around the Sun (forward-scattered electrons, smeared by resolution);
// background events land anywhere. Planning values; F-34 is marked "check".
export const FIELD_DEGREES = 90;
export const SIGNAL_FRACTION = 0.4;
export const SIGNAL_SIGMA_DEGREES = 14;

export interface SkyEvent { x: number; y: number; signal: boolean; flavor: Flavor }

// Share of arrivals shown in each flavor: about a third electron (F-14), the rest split.
const FLAVOR_SHARE: [Flavor, number][] = [['electron', 0.34], ['muon', 0.33], ['tau', 0.33]];

function pickFlavor(rand: () => number): Flavor {
  let r = rand();
  for (const [f, share] of FLAVOR_SHARE) {
    r -= share;
    if (r <= 0) return f;
  }
  return 'tau';
}

export function sampleEvent(rand: () => number): SkyEvent {
  const half = FIELD_DEGREES / 2;
  if (rand() < SIGNAL_FRACTION) {
    let x: number;
    let y: number;
    do {
      x = gaussian(rand) * SIGNAL_SIGMA_DEGREES;
      y = gaussian(rand) * SIGNAL_SIGMA_DEGREES;
    } while (Math.abs(x) > half || Math.abs(y) > half);
    return { x, y, signal: true, flavor: pickFlavor(rand) };
  }
  return { x: (rand() * 2 - 1) * half, y: (rand() * 2 - 1) * half, signal: false, flavor: pickFlavor(rand) };
}

// Deterministic so the map builds the same way on every run.
export function seeded(seed: number): () => number {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gaussian(rand: () => number): number {
  return Math.sqrt(-2 * Math.log(1 - rand())) * Math.cos(2 * Math.PI * rand());
}
