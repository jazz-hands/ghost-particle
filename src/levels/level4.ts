import {
  AdditiveBlending, BufferAttribute, BufferGeometry, CanvasTexture, Color, Points, PointsMaterial,
  SRGBColorSpace, Sprite, SpriteMaterial, Vector3,
} from 'three';
import type { Mesh, MeshStandardMaterial } from 'three';
import { cycleFlavor } from '../content/flavors.ts';
import { cardSeconds } from './beats.ts';
import type { Flavor } from '../content/flavors.ts';
import { box, cone, plane, sphere } from '../render/prims.ts';
import type { GridTile } from '../hud/hud.ts';
import { scriptedLevel } from './scripted.ts';
import { createNeutrino } from '../character/neutrino.ts';
import { setCurrentNeutrino } from '../character/current.ts';
import { CONFIG } from '../character/config.ts';
import type { CharacterConfig } from '../character/config.ts';
import { prefersReducedMotion } from '../render/rig.ts';

// Two flavor shifts (1.5 s each) of travel before the grid at 40%, then a 3 s dash to Earth.
const TRIP_SECONDS = 7.5;
const GRID_AT = 0.4;
const DASH_SECONDS = 3;
const KM = 149_597_870.7;
const LIGHT_SECONDS = 499;
const HOP = 0.5;
// The character's body sphere has radius 1; the blockout's ghost was half that.
const CHARACTER_SCALE = 0.5;

// The starfield is one Points draw call. Cool white-blue against the stage's navy; each star
// keeps its own layer speed, so the near ones sweep past while the far ones barely move.
const STAR_COUNT = 900;
const STAR_BLUE = '#cfe4ff';
const STAR_SIZE = 0.07;
const STAR_OPACITY = 0.85;
const STAR_SPREAD_X = 18;
const STAR_SPREAD_Y = 11;
const STAR_DEPTH = 70;
const STAR_AHEAD = 10;
const STAR_DRIFT = 2;
const STAR_RUSH = 40;
const STAR_SLOWEST = 0.4;

// The Sun keeps levels 1 and 2's amber family, so the star left behind is the one you were born
// in: a warm emissive disc inside a soft additive halo, both shrinking together.
const SUN_RADIUS = 5;
const SUN_CORE = '#ffe6bd';
const SUN_GLOW = '#ff9f45';
const SUN_EMISSIVE = 0.9;
const SUN_GLOW_SIZE = 12;
// Off the camera's left shoulder and low, where neither the grid nor the caption sits: the
// blockout put it behind the camera, where none of the shrinking could be seen.
const SUN_AT = new Vector3(-34, -18, -11);
const SUN_GLOW_OPACITY = 0.35;
const SUN_SHRINK = 0.85;

// Earth is procedural: a deep ocean blue body under a slightly larger translucent white shell
// that reads as cloud once it fills the view. No textures, two draw calls.
const EARTH_RADIUS = 0.2;
const EARTH_GROW = 29;
const EARTH_BLUE = '#2f6bd8';
const EARTH_EMISSIVE = 0.3;
const CLOUD_WHITE = '#eef4ff';
const CLOUD_SHELL = 1.07;
const CLOUD_OPACITY = 0.3;

// The dive: soft white sheets, then cool dark rock lit only by an emissive rim, so the ground
// and the mountain still have an edge against the navy as the plunge goes through them.
const DIVE_CLOUD_WHITE = '#dce8f5';
const DIVE_CLOUD_OPACITY = 0.3;
const ROCK_GREY = '#3a4550';
const ROCK_RIM = '#6fa8d6';
const ROCK_RIM_EMISSIVE = 0.45;

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
// One line per family as its row of tiles arrives (F-16).
// Each family arrives with its own sound.
const FAMILIES: [string, string, 'pop' | 'blip' | 'thwip' | 'chime'][] = [
  ['Quarks', 'Quarks: the pieces inside protons and neutrons.', 'pop'],
  ['Leptons', 'Leptons: the electron and its cousins.', 'blip'],
  ['Force carriers', 'Force carriers: what pushes and pulls.', 'thwip'],
  ['Higgs', 'The Higgs: where mass comes from.', 'chime'],
];
// Screen-right of the camera at (4, 1.5, 5): where the neutrino sits, smaller, to watch the grid.
const ASIDE = new Vector3(1.25, -0.35, -0.6);
const ASIDE_SCALE = 0.85;
const REVEALED = 'Ghost particles. Almost no mass, no charge, three flavors.';
const FOUND = "Found you. You're one of the three neutrinos, in the lepton family, next to the electron.";
// Family cards get a second over the reading time: the new tiles are read alongside them.
const FAMILY_EXTRA = 1;
// Halfway down the plunge, where the mountain takes over from the clouds.
const ROCK_AT = 1.8;
// The plunge is the only shake in the level; CameraRig drops it under reduced motion. The star
// speed and the dive itself are unchanged either way.
const DIVE_SHAKE = 0.06;

export const createLevel4 = scriptedLevel(4, async (s) => {
  const ghost = createNeutrino(characterConfig());
  ghost.group.scale.setScalar(CHARACTER_SCALE);
  setCurrentNeutrino(ghost);
  s.group.add(ghost.group);
  // exit() clears the level group, and three.js announces that to each child: the only
  // teardown hook a scripted level gets.
  ghost.group.addEventListener('removed', () => {
    setCurrentNeutrino(null);
    ghost.dispose();
  });
  s.onUpdate((dt) => ghost.update(dt));
  s.rig.set({ x: 4, y: 1.5, z: 5 }, { x: 0, y: 0, z: 0 });
  // Level 3 ends faded to black; open on the stars.
  void s.hud.fade(0, 0.8);

  const sun = glow(sphere(SUN_RADIUS, { color: SUN_CORE }), SUN_CORE, SUN_EMISSIVE);
  const halo = new Sprite(new SpriteMaterial({
    map: glowTexture(),
    color: new Color(SUN_GLOW),
    transparent: true,
    opacity: SUN_GLOW_OPACITY,
    blending: AdditiveBlending,
    depthWrite: false,
  }));
  halo.scale.setScalar(SUN_GLOW_SIZE);
  sun.add(halo);
  sun.position.copy(SUN_AT);
  s.group.add(sun);
  // Sprite materials go with the level group; the texture they share does not.
  sun.addEventListener('removed', () => halo.material.map?.dispose());

  const earth = glow(sphere(EARTH_RADIUS, { color: EARTH_BLUE }), EARTH_BLUE, EARTH_EMISSIVE);
  const clouds = sphere(EARTH_RADIUS, { color: CLOUD_WHITE, opacity: CLOUD_OPACITY });
  clouds.scale.setScalar(CLOUD_SHELL);
  (clouds.material as MeshStandardMaterial).depthWrite = false;
  earth.add(clouds);
  const earthFrom = new Vector3(6, 0, -30);
  const earthTo = new Vector3(0, 0, -4);
  earth.position.copy(earthFrom);
  s.group.add(earth);

  const stars = starfield();
  s.group.add(stars.points);

  let p = 0;
  let paused = false;
  let rushing = false;
  let shown: Flavor | null = null;
  let hopLeft = 0;

  const readout = (): void => {
    s.hud.readout(`${Math.round(p * KM).toLocaleString()} km, ${(p * LIGHT_SECONDS).toFixed(0)} light-seconds`);
  };

  s.onUpdate((dt) => {
    let speed = paused ? 0 : 1;
    if (rushing) speed *= ((1 - GRID_AT) * TRIP_SECONDS) / DASH_SECONDS;
    if (speed > 0 && p < 1) {
      p = Math.min(p + (dt * speed) / TRIP_SECONDS, 1);
      readout();
    }

    sun.scale.setScalar(1 - SUN_SHRINK * p);
    earth.scale.setScalar(1 + EARTH_GROW * p);
    earth.position.lerpVectors(earthFrom, earthTo, p);

    const drift = (STAR_DRIFT + STAR_RUSH * speed) * dt;
    for (let i = 0; i < STAR_COUNT; i += 1) {
      const z = i * 3 + 2;
      stars.positions[z] += drift * stars.layers[i]!;
      if (stars.positions[z]! > STAR_AHEAD) stars.positions[z] -= STAR_DEPTH;
    }
    stars.points.geometry.attributes.position!.needsUpdate = true;

    const f = cycleFlavor(s.time);
    if (f !== shown) {
      shown = f;
      ghost.setFlavor(f);
      s.hud.flavor(f);
    }

    if (hopLeft > 0) {
      hopLeft = Math.max(hopLeft - dt, 0);
      ghost.group.position.y = ASIDE.y + Math.sin((1 - hopLeft / HOP) * Math.PI) * 0.5;
    }
  });

  // F-15, F-30: the travel meter reads kilometres and light-seconds.
  readout();
  // One soft tick as the meter appears (4.1). The trip has no tick loop.
  s.cues.tick();
  ghost.react('nod');
  await s.b.card('Out of the Sun, into space. Earth is 150 million kilometers away. Light takes about 8 minutes 20 seconds to get there. So do you.', ['F-15']);

  ghost.react('wiggle');
  await s.b.until(() => p >= GRID_AT);
  paused = true;
  ghost.react('nod');
  s.cues.blip();
  await s.b.card('Halfway to Earth. Before you arrive, meet the family: every particle matter is made of, on one chart.', ['F-16']);

  let aside = 0;
  s.onUpdate((dt) => {
    if (aside >= 1) return;
    aside = Math.min(aside + dt / 0.6, 1);
    const u = aside * aside * (3 - 2 * aside);
    ghost.group.position.lerpVectors(new Vector3(0, 0, 0), ASIDE, u);
    ghost.group.scale.setScalar(CHARACTER_SCALE * (1 - (1 - ASIDE_SCALE) * u));
  });

  const grid = s.hud.grid(TILES, 6, { reveal: true });
  let hunting = false;
  for (const [row, line, cue] of FAMILIES) {
    grid.show(row);
    ghost.react('peek');
    s.cues[cue]();
    await s.b.card(line, ['F-16'], { seconds: cardSeconds(line) + FAMILY_EXTRA });
  }
  hunting = true;
  ghost.react('wave');
  s.hud.note('This is the Standard Model, the list of everything matter is made of. Find yourself: arrow keys to move, Space to pick.', ['F-16']);
  let found = false;
  grid.onPick((i) => {
    if (found || !hunting) return;
    if (!NEUTRINO_TILES.includes(i)) {
      grid.wiggle(i, 2);
      ghost.react('shrug');
      s.cues.buzz();
      s.hud.note(TILES[i]!.label, ['F-16']);
      return;
    }
    found = true;
    grid.mark(i);
    hopLeft = HOP;
    ghost.react('cheer');
    s.cues.tada();
    s.hud.note(null);
    for (const n of NEUTRINO_TILES) grid.setLabel(n, REVEALED);
  });
  await s.b.until(() => found);

  await s.b.card(FOUND, ['F-16']);
  grid.close();
  paused = false;

  rushing = true;
  ghost.react('proud');
  await s.b.until(() => p >= 1);

  // 4.8: down through cloud layers, over the ground, into the mountain.
  for (let i = 0; i < 3; i += 1) {
    const cloud = plane(6, 3, { color: DIVE_CLOUD_WHITE, opacity: DIVE_CLOUD_OPACITY });
    (cloud.material as MeshStandardMaterial).depthWrite = false;
    cloud.rotation.x = -Math.PI / 2;
    cloud.position.set((i - 1) * 1.5, 6 - i * 2, -8 - i * 4);
    s.group.add(cloud);
  }
  const ground = rock(box(8, 0.2, 4, { color: ROCK_GREY }));
  ground.position.set(0, -2, -18);
  s.group.add(ground);
  const mountain = rock(cone(3, 4, { color: ROCK_GREY }));
  mountain.position.set(0, 0, -18);
  s.group.add(mountain);

  s.hud.readout(null);
  ghost.react('brace');
  s.cues.whoosh();
  s.rig.shake(DIVE_SHAKE);
  const dive = s.rig.moveTo({ x: 0, y: -0.5, z: -18 }, { x: 0, y: -2, z: -24 }, 3);
  await s.b.wait(ROCK_AT);
  ghost.react('surprised');
  s.cues.thwip();
  await dive;
  s.rig.shake(0);
  await s.b.card("Down through the clouds, over Japan, into a mountain: the Kamioka mine, 1,000 meters underground. Rock doesn't stop you either.", ['F-19']);
});

// The beat sheet's reduced-motion rule: the idle bob goes, nothing else changes.
function characterConfig(): CharacterConfig {
  if (!prefersReducedMotion()) return CONFIG;
  return { ...CONFIG, view: { ...CONFIG.view, idleBob: false } };
}

interface Starfield { points: Points; positions: Float32Array; layers: Float32Array }

function starfield(): Starfield {
  const positions = new Float32Array(STAR_COUNT * 3);
  const layers = new Float32Array(STAR_COUNT);
  for (let i = 0; i < STAR_COUNT; i += 1) {
    positions[i * 3] = (Math.random() * 2 - 1) * STAR_SPREAD_X;
    positions[i * 3 + 1] = (Math.random() * 2 - 1) * STAR_SPREAD_Y;
    positions[i * 3 + 2] = STAR_AHEAD - Math.random() * STAR_DEPTH;
    layers[i] = STAR_SLOWEST + Math.random() * (1 - STAR_SLOWEST);
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(positions, 3));
  const points = new Points(geometry, new PointsMaterial({
    color: STAR_BLUE,
    size: STAR_SIZE,
    sizeAttenuation: true,
    transparent: true,
    opacity: STAR_OPACITY,
    depthWrite: false,
  }));
  return { points, positions, layers };
}

function glowTexture(): CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 256;
  const g = canvas.getContext('2d')!;
  const gradient = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.35, 'rgba(255,255,255,0.35)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gradient;
  g.fillRect(0, 0, 256, 256);
  const tex = new CanvasTexture(canvas);
  tex.colorSpace = SRGBColorSpace;
  return tex;
}

function glow(mesh: Mesh, color: string, intensity: number): Mesh {
  const material = mesh.material as MeshStandardMaterial;
  material.emissive = new Color(color);
  material.emissiveIntensity = intensity;
  material.roughness = 0.4;
  material.metalness = 0;
  return mesh;
}

// Dark and matte, with the rim colour carried as a faint emissive so the silhouette survives.
function rock(mesh: Mesh): Mesh {
  const material = mesh.material as MeshStandardMaterial;
  material.emissive = new Color(ROCK_RIM);
  material.emissiveIntensity = ROCK_RIM_EMISSIVE;
  material.roughness = 0.95;
  material.metalness = 0;
  return mesh;
}
