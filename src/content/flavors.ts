// D-011: the three flavors and their tints.
export type Flavor = 'electron' | 'muon' | 'tau';

export const FLAVORS: readonly Flavor[] = ['electron', 'muon', 'tau'];

export const TINTS: Record<Flavor, string> = {
  electron: '#5ee3ff',
  muon: '#b58cff',
  tau: '#ff9f6b',
};

const PERIOD = 1.5;

/** Continuous cycle used by levels 3 and 4: one flavor every 1.5 s, in FLAVORS order. */
export function cycleFlavor(t: number): Flavor {
  const i = Math.floor(t / PERIOD) % FLAVORS.length;
  return FLAVORS[(i + FLAVORS.length) % FLAVORS.length]!;
}
