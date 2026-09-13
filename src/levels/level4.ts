import { Group, Vector3 } from 'three';
import type { Mesh } from 'three';
import { FLAVORS, cycleFlavor } from '../content/flavors.ts';
import type { Flavor } from '../content/flavors.ts';
import { box, cone, neutrino, plane, sphere, tint } from '../render/prims.ts';
import type { GridTile } from '../hud/hud.ts';
import { scriptedLevel } from './scripted.ts';

const TRIP_SECONDS = 30;
const KM = 149_597_870.7;
const LIGHT_SECONDS = 499;
const STREAKS = 200;
const HOLD = 0.6;
const HOP = 0.5;

// F-16: the Standard Model, four rows of six columns; the three neutrinos hide behind a "?".
const TILES: GridTile[] = [
  { row: 'Quarks', name: 'Up', label: 'Found inside every proton and neutron' },
  { row: 'Quarks', name: 'Down', label: 'Found inside every proton and neutron too' },
  { row: 'Quarks', name: 'Charm', label: 'A heavier cousin of Up' },
  { row: 'Quarks', name: 'Strange', label: 'A heavier cousin of Down' },
  { row: 'Quarks', name: 'Top', label: 'The heaviest particle known' },
  { row: 'Quarks', name: 'Bottom', label: 'A heavier cousin of Strange' },
  { row: 'Leptons', name: 'Electron', label: 'Orbits atoms and carries electricity' },
  { row: 'Leptons', name: 'Muon', label: 'A heavy electron that lives a few millionths of a second' },
  { row: 'Leptons', name: 'Tau', label: 'An even heavier electron, gone even faster' },
  { row: 'Leptons', name: 'Electron neutrino', label: '?' },
  { row: 'Leptons', name: 'Muon neutrino', label: '?' },
  { row: 'Leptons', name: 'Tau neutrino', label: '?' },
  { row: 'Force carriers', name: 'Photon', label: 'Carries light and the electric force' },
  { row: 'Force carriers', name: 'Gluon', label: 'Glues quarks together' },
  { row: 'Force carriers', name: 'W', label: "Carries the weak force, which lets the Sun's fusion happen" },
  { row: 'Force carriers', name: 'Z', label: 'Carries the weak force too, the only force a neutrino feels besides gravity' },
  { row: 'Higgs', name: 'Higgs', label: 'Its field is what gives the other particles their mass' },
];

const NEUTRINO_TILES = [9, 10, 11];
const REVEALED = 'Ghost particles. Almost no mass, no charge, three flavors.';

export const createLevel4 = scriptedLevel(4, async (s) => {
  const ghost = neutrino();
  s.group.add(ghost);
  s.rig.set({ x: 4, y: 1.5, z: 5 }, { x: 0, y: 0, z: 0 });

  const sun = sphere(4);
  sun.position.set(-6, 0, 25);
  s.group.add(sun);

  const earth = sphere(0.2);
  const earthFrom = new Vector3(6, 0, -30);
  const earthTo = new Vector3(0, 0, -4);
  earth.position.copy(earthFrom);
  s.group.add(earth);

  const streaks = new Group();
  const bars: Mesh[] = [];
  for (let i = 0; i < STREAKS; i += 1) {
    const bar = box(0.02, 0.02, 0.6);
    bar.position.set((Math.random() * 2 - 1) * 14, (Math.random() * 2 - 1) * 8, -60 + Math.random() * 70);
    streaks.add(bar);
    bars.push(bar);
  }
  s.group.add(streaks);

  let p = 0;
  let paused = false;
  let rushing = false;
  let shown: Flavor | null = null;
  let holding: Flavor | null = null;
  let holdLeft = 0;
  let hopLeft = 0;
  const tally: Record<Flavor, number> = { electron: 0, muon: 0, tau: 0 };

  const readout = (): void => {
    s.hud.readout(`${Math.round(p * KM).toLocaleString()} km, ${(p * LIGHT_SECONDS).toFixed(0)} light-seconds`);
  };
  const tallyLine = (): void => {
    s.hud.sub([`electron ${tally.electron} · muon ${tally.muon} · tau ${tally.tau}`]);
  };

  s.onUpdate((dt) => {
    let speed = paused ? 0 : 1;
    if (s.hud.cardUp) speed /= 3;
    if (s.keys.isDown('ArrowRight')) speed *= 4;
    if (rushing) speed *= 8;
    if (speed > 0 && p < 1) {
      p = Math.min(p + (dt * speed) / TRIP_SECONDS, 1);
      readout();
    }

    sun.scale.setScalar(1 - 0.85 * p);
    earth.scale.setScalar(1 + 29 * p);
    earth.position.lerpVectors(earthFrom, earthTo, p);

    const drift = (2 + 40 * speed) * dt;
    for (const bar of bars) {
      bar.position.z += drift;
      if (bar.position.z > 10) bar.position.z -= 70;
    }

    if (holdLeft > 0) {
      holdLeft -= dt;
      if (holdLeft <= 0) holding = null;
    }
    const f = holding ?? cycleFlavor(s.time);
    if (f !== shown) {
      shown = f;
      tint(ghost, f);
      s.hud.flavor(f);
    }

    if (hopLeft > 0) {
      hopLeft = Math.max(hopLeft - dt, 0);
      ghost.position.y = Math.sin((1 - hopLeft / HOP) * Math.PI) * 0.5;
    }
  });

  // F-15, F-30: the travel meter reads kilometres and light-seconds.
  readout();
  await s.b.card('150 million kilometers to Earth. Light takes about 8 minutes 20 seconds. So do you. Hold the right arrow to fast-forward.', ['F-15']);

  await s.b.until(() => p >= 0.15);
  tallyLine();
  s.keys.onPress('KeyM', () => {
    const picked = FLAVORS[Math.floor(Math.random() * FLAVORS.length)]!;
    tally[picked] += 1;
    holding = picked;
    holdLeft = HOLD;
    tallyLine();
  });
  await s.b.card('Press M to measure your flavor. Keep going. Notice the pattern.', ['F-12', 'F-14']);

  await s.b.until(() => p >= 0.4);
  paused = true;
  const grid = s.hud.grid(TILES, 6);
  s.hud.note('This is the Standard Model, the list of everything matter is made of. Find yourself.', ['F-16']);
  let found = false;
  grid.onPick((i) => {
    if (found) return;
    if (!NEUTRINO_TILES.includes(i)) {
      grid.wiggle(i, 2);
      s.hud.note(TILES[i]!.label, ['F-16']);
      return;
    }
    found = true;
    grid.mark(i);
    hopLeft = HOP;
    s.hud.note("Found you. You're one of the three neutrinos, in the lepton family, next to the electron.", ['F-16']);
    for (const n of NEUTRINO_TILES) grid.setLabel(n, REVEALED);
  });
  await s.b.until(() => found);

  await s.b.key('Space');
  grid.close();
  s.hud.note(null);
  paused = false;

  s.keys.onPress('Space', () => { rushing = true; });
  await s.b.until(() => p >= 1);

  // 4.8: down through cloud layers, over the ground, into the mountain.
  for (let i = 0; i < 3; i += 1) {
    const cloud = plane(6, 3, { opacity: 0.4 });
    cloud.rotation.x = -Math.PI / 2;
    cloud.position.set((i - 1) * 1.5, 6 - i * 2, -8 - i * 4);
    s.group.add(cloud);
  }
  const ground = box(8, 0.2, 4);
  ground.position.set(0, -2, -18);
  s.group.add(ground);
  const mountain = cone(3, 4);
  mountain.position.set(0, 0, -18);
  s.group.add(mountain);

  s.hud.readout(null);
  await s.rig.moveTo({ x: 0, y: -0.5, z: -18 }, { x: 0, y: -2, z: -24 }, 3);
  await s.b.card("Arriving: Kamioka mine, Japan. 1,000 meters underground. Rock doesn't stop you either.", ['F-19']);
});
