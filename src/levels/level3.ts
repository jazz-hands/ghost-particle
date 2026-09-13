import {
  AdditiveBlending, BoxGeometry, CanvasTexture, CircleGeometry, Color, DoubleSide, FogExp2,
  Group, InstancedMesh, Mesh, MeshStandardMaterial, Object3D, PlaneGeometry, SphereGeometry,
  SRGBColorSpace, Sprite, SpriteMaterial,
} from 'three';
import { cycleFlavor } from '../content/flavors.ts';
import type { Flavor } from '../content/flavors.ts';
import { disposeGroup } from '../render/prims.ts';
import { scriptedLevel } from './scripted.ts';
import { cardSeconds } from './beats.ts';
import { createNeutrino } from '../character/neutrino.ts';
import { setCurrentNeutrino } from '../character/current.ts';
import { CONFIG } from '../character/config.ts';
import type { CharacterConfig } from '../character/config.ts';
import { prefersReducedMotion } from '../render/rig.ts';
import { hint } from '../hud/hints.ts';

const LANE = 2;
const STEER = 3;
const RAIL = 12;
const SPAWN_Z = -60;
const HALT_Z = -5;
const TRY_Z = -20;

// Inside a star, in one warm family. The deep core orange is both the background and the fog,
// so obstacles fade into the haze instead of ending at a silhouette; the climb lands on an
// orange-white surface. Emissive values are set against the stage's bloom threshold of 0.71.
const CORE_ORANGE = '#7d1c03';
// The surface glow stays a mid amber: the flavor change has to read against it.
const SURFACE_GOLD = '#b8641c';
const DAWN_MAX = 0.55;
const FOG_DENSITY = 0.055;
// 3.5: the haze thins.
const FOG_THIN = 0.032;
// 3.6: it keeps thinning as the surface brightens.
const FOG_SURFACE = 0.012;
// The star's own glare, one unfogged sprite behind every obstacle.
const GLARE_AMBER = '#ff8a28';
const GLARE_SIZE = 42;
const GLARE_Z = -56;
const GLARE_OPACITY = 0.5;
// Plasma walls are glowing translucent sheets; the wall of light is brighter and whiter.
const PLASMA_ORANGE = '#ffae52';
const PLASMA_OPACITY = 0.45;
const PLASMA_EMISSIVE = 1.8;
const LIGHT_WALL = '#fff4de';
const LIGHT_WALL_OPACITY = 0.7;
const LIGHT_WALL_EMISSIVE = 2.6;
const WALL_W = 12;
const WALL_H = 8;
const GAP_HALF_W = 5;
const GAP_HALF_X = 3.5;
// A knot of nuclei: small white-hot spheres, one InstancedMesh per knot.
const NUCLEI_WHITE = '#ffeec6';
const NUCLEI_EMISSIVE = 2.1;
const KNOT_BEADS = 12;
const KNOT_RADIUS = 0.22;
const KNOT_SPREAD = 1.2;
// 3.7: a large emissive disc, sized to glare inside the frame rather than fill it; the
// bloom pass makes the halo.
const SUN_GOLD = '#ffdc9b';
const SUN_EMISSIVE = 2.2;
const SUN_RADIUS = 3.2;
const LOOKBACK_Z = -6;
const EMERGE_FROM_Z = 12;
const EMERGE_TO_Z = -2;
const EMERGE_SECONDS = 2;
const SWING_SECONDS = 2.5;
// The rush blur: plasma drawn past the camera as streaks. Off under reduced motion.
const STREAK_COLOR = '#ffd9a0';
const STREAK_COUNT = 64;
const STREAK_LENGTH = 3;
const STREAK_THICKNESS = 0.035;
const STREAK_EMISSIVE = 1.6;
const STREAK_OPACITY = 0.4;
const STREAK_SPEED = RAIL * 2.4;
// Kept off the rail itself, so the streaks never sit in front of the character.
const STREAK_NEAR = 1.8;
const STREAK_FAR = 8;
// The character's body sphere has radius 1; the blockout's ghost was half that.
const CHARACTER_SCALE = 0.5;
// Far enough out that the squash lands before the obstacle arrives.
const BRACE_Z = -10;
// The two-part reactions (3.3, 3.6) read as one beat at this spacing.
const BEAT_GAP = 0.8;

const FLAVOR_CARD = "Neutrinos come in three kinds, called flavors: electron, muon, and tau. You were born electron-flavor. But look at your colour. You're changing.";
const MASS_CARD = "A neutrino can only change flavor if it has at least a little mass. That's how we know you aren't weightless.";

interface Obstacle {
  object: Object3D;
  passed: boolean;
  halts: boolean;
  braced: boolean;
  index: number;
}

export const createLevel3 = scriptedLevel(3, async (s) => {
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
  ghost.setFlavor('electron');
  s.onUpdate((dt) => ghost.update(dt));

  const timers: { left: number; fn: () => void }[] = [];
  const after = (seconds: number, fn: () => void): void => { timers.push({ left: seconds, fn }); };

  const stageBackground = s.scene.background;
  const base = new Color(CORE_ORANGE);
  const surface = new Color(SURFACE_GOLD);
  const sky = new Color().copy(base);
  const fog = new FogExp2(CORE_ORANGE, FOG_DENSITY);
  s.scene.fog = fog;
  s.scene.background = sky;

  const glareTex = glareTexture();
  const glare = new Sprite(new SpriteMaterial({
    map: glareTex,
    color: new Color(GLARE_AMBER),
    transparent: true,
    opacity: GLARE_OPACITY,
    blending: AdditiveBlending,
    depthWrite: false,
    fog: false,
  }));
  glare.scale.setScalar(GLARE_SIZE);
  glare.position.z = GLARE_Z;
  glare.renderOrder = -1;
  s.group.add(glare);
  glare.addEventListener('removed', () => glareTex.dispose());

  const streaks = prefersReducedMotion() ? null : rushBlur();
  if (streaks) s.group.add(streaks.mesh);

  const obstacles: Obstacle[] = [];
  let lane = 0;
  let tally = 0;
  let autos = 0;
  let follow = true;
  let spawning = false;
  let spawnIn = 0;
  let cycling = false;
  let shown: Flavor | null = null;
  let dawn = 0;
  let rising = false;
  let steered = false;

  const add = (object: Object3D, halts = false): void => {
    object.position.z = halts ? TRY_Z : SPAWN_Z;
    s.group.add(object);
    obstacles.push({ object, passed: false, halts, braced: false, index: halts ? -1 : autos++ });
  };

  const plasmaWall = (gap: boolean): Object3D => {
    if (!gap) return sheet(WALL_W, WALL_H, PLASMA_ORANGE, PLASMA_OPACITY, PLASMA_EMISSIVE);
    const wall = new Group();
    for (const side of [-1, 1]) {
      const half = sheet(GAP_HALF_W, WALL_H, PLASMA_ORANGE, PLASMA_OPACITY, PLASMA_EMISSIVE);
      half.position.x = side * GAP_HALF_X;
      wall.add(half);
    }
    return wall;
  };

  const knot = (): Object3D => {
    const cluster = new InstancedMesh(
      new SphereGeometry(KNOT_RADIUS, 12, 8),
      glowMaterial(NUCLEI_WHITE, NUCLEI_EMISSIVE),
      KNOT_BEADS,
    );
    const bead = new Object3D();
    for (let i = 0; i < KNOT_BEADS; i += 1) {
      bead.position.set(spread(KNOT_SPREAD), spread(KNOT_SPREAD), spread(KNOT_SPREAD));
      bead.scale.setScalar(0.7 + Math.random() * 0.6);
      bead.updateMatrix();
      cluster.setMatrixAt(i, bead.matrix);
    }
    cluster.instanceMatrix.needsUpdate = true;
    cluster.position.x = spread(LANE);
    return cluster;
  };

  const wallOfLight = (): Object3D =>
    sheet(WALL_W, WALL_H, LIGHT_WALL, LIGHT_WALL_OPACITY, LIGHT_WALL_EMISSIVE);

  // Some have gaps, most don't (3.4).
  const nextObstacle = (): Object3D => {
    const roll = Math.random();
    if (roll < 0.35) return knot();
    if (roll < 0.55) return plasmaWall(true);
    if (roll < 0.85) return plasmaWall(false);
    return wallOfLight();
  };

  s.onUpdate((dt) => {
    for (let i = timers.length - 1; i >= 0; i -= 1) {
      const t = timers[i]!;
      t.left -= dt;
      if (t.left > 0) continue;
      timers.splice(i, 1);
      t.fn();
    }

    if (s.keys.isDown('ArrowLeft')) { lane -= STEER * dt; steered = true; }
    if (s.keys.isDown('ArrowRight')) { lane += STEER * dt; steered = true; }
    lane = Math.min(Math.max(lane, -LANE), LANE);
    if (follow) {
      ghost.group.position.x = lane;
      s.rig.set({ x: lane * 0.5, y: 0.5, z: 6 }, { x: ghost.group.position.x, y: ghost.group.position.y - 0.6, z: 0 });
    }

    streaks?.update(dt);

    if (spawning) {
      spawnIn -= dt;
      if (spawnIn <= 0) {
        add(nextObstacle());
        spawnIn = 1.5 + Math.random() * 0.5;
      }
    }

    for (const o of [...obstacles]) {
      // The first two obstacles wait just ahead until the player steers (3.2), then autoplay.
      if (o.halts && !steered && o.object.position.z + RAIL * dt >= HALT_Z) {
        o.object.position.z = HALT_Z;
        s.hud.prompt(hint('steer'));
        continue;
      }
      o.object.position.z += RAIL * dt;
      // The held walls brace the moment they come on again; the run's first two brace on approach.
      if (!o.braced && o.object.position.z >= (o.halts ? HALT_Z : BRACE_Z) && (o.halts || o.index < 2)) {
        o.braced = true;
        ghost.react('brace');
      }
      if (!o.passed && o.object.position.z >= 0) {
        o.passed = true;
        tally += 1;
        s.cues.thwip(tally);
        ghost.react(o.braced ? 'surprised' : 'wiggle');
      }
      if (o.object.position.z > 8) {
        disposeGroup(o.object);
        obstacles.splice(obstacles.indexOf(o), 1);
      }
    }

    if (cycling) {
      const f = cycleFlavor(s.time);
      if (f !== shown) {
        shown = f;
        ghost.setFlavor(f);
        s.hud.flavor(f);
      }
    }

    if (rising && dawn < 1) {
      dawn = Math.min(dawn + dt / 6, 1);
      s.scene.background = sky.copy(base).lerp(surface, dawn * DAWN_MAX);
      fog.color.copy(sky);
      fog.density = FOG_THIN + (FOG_SURFACE - FOG_THIN) * dawn;
    }
  });

  await s.hud.fade(0, 0.5);

  // 3.1
  s.cues.whoosh();
  ghost.react('nod');
  await s.b.card(`You're leaving the Sun. Everything in here is packed tight. Try to hit something. ${hint('steer')}.`);

  // 3.2
  for (const gap of [false, true]) {
    steered = false;
    add(plasmaWall(gap), true);
    const before = tally;
    await s.b.until(() => tally > before);
    s.hud.prompt(null);
  }

  // 3.3
  ghost.react('surprised');
  after(BEAT_GAP, () => ghost.react('wiggle'));
  await s.b.card("Nothing happened. Light can't get through the Sun, but you slip through almost everything. Almost nothing can stop a neutrino.", ['F-10']);

  // 3.4
  spawning = true;
  spawnIn = 0.5;
  await s.b.wait(3);

  // 3.5
  fog.density = FOG_THIN;
  ghost.react('nod');
  await s.b.card('Light from the core takes tens of thousands of years or more to get out. It keeps bumping into things. You take about 2 seconds.', ['F-08', 'F-09']);

  // 3.6
  cycling = true;
  spawning = false;
  rising = true;
  ghost.react('look-at-self');
  after(BEAT_GAP, () => ghost.react('shrug'));
  s.cues.risingTone(cardSeconds(FLAVOR_CARD) + cardSeconds(MASS_CARD));
  await s.b.card(FLAVOR_CARD, ['F-12']);
  await s.b.card(MASS_CARD, ['F-05']);

  // 3.7: out of the surface into black space, the Sun glaring behind.
  s.scene.fog = null;
  s.scene.background = stageBackground;
  const sun = new Mesh(new CircleGeometry(SUN_RADIUS, 64), glowMaterial(SUN_GOLD, SUN_EMISSIVE));
  sun.material.side = DoubleSide;
  sun.position.set(0, 0, 30);
  s.group.add(sun);
  follow = false;
  s.cues.whoosh();
  s.cues.tada();
  // The camera turns to the Sun; the neutrino comes out of the glare toward it, then the view
  // swings round to level 4's framing (camera at the neutrino plus (4, 1.5, 5)) before the fade.
  ghost.group.position.set(0, 0, EMERGE_FROM_Z);
  await s.rig.moveTo({ x: 0, y: 0.8, z: LOOKBACK_Z }, { x: 0, y: 0, z: 30 }, 1.5);
  ghost.react('cheer');
  let out = 0;
  s.onUpdate((dt) => {
    if (out >= 1) return;
    out = Math.min(out + dt / EMERGE_SECONDS, 1);
    const u = out * out * (3 - 2 * out);
    ghost.group.position.set(0, 0, EMERGE_FROM_Z + (EMERGE_TO_Z - EMERGE_FROM_Z) * u);
    s.rig.set({ x: 0, y: 0.8, z: LOOKBACK_Z }, ghost.group.position);
  });
  await s.b.wait(EMERGE_SECONDS);
  await s.rig.moveTo({ x: 4, y: 1.5, z: EMERGE_TO_Z + 5 }, { x: 0, y: 0, z: EMERGE_TO_Z }, SWING_SECONDS);
  await s.hud.fade(1, 0.4);
});

interface RushBlur { mesh: InstancedMesh; update(dt: number): void }

// One instanced mesh of thin bars flying past. The beat sheet turns this off under a
// reduced-motion preference; steering and the obstacles are untouched either way.
function rushBlur(): RushBlur {
  const material = glowMaterial(STREAK_COLOR, STREAK_EMISSIVE, STREAK_OPACITY);
  material.blending = AdditiveBlending;
  const mesh = new InstancedMesh(
    new BoxGeometry(STREAK_THICKNESS, STREAK_THICKNESS, STREAK_LENGTH),
    material,
    STREAK_COUNT,
  );
  const at = new Object3D();
  const z = new Float32Array(STREAK_COUNT);
  const x = new Float32Array(STREAK_COUNT);
  const y = new Float32Array(STREAK_COUNT);

  const place = (i: number, front: boolean): void => {
    const angle = Math.random() * Math.PI * 2;
    const radius = STREAK_NEAR + Math.random() * (STREAK_FAR - STREAK_NEAR);
    x[i] = Math.cos(angle) * radius;
    y[i] = Math.sin(angle) * radius;
    z[i] = front ? SPAWN_Z * Math.random() : SPAWN_Z;
  };
  for (let i = 0; i < STREAK_COUNT; i += 1) place(i, true);

  const write = (): void => {
    for (let i = 0; i < STREAK_COUNT; i += 1) {
      at.position.set(x[i]!, y[i]!, z[i]!);
      at.updateMatrix();
      mesh.setMatrixAt(i, at.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  };
  write();

  return {
    mesh,
    update(dt) {
      for (let i = 0; i < STREAK_COUNT; i += 1) {
        z[i]! += STREAK_SPEED * dt;
        if (z[i]! > 8) place(i, false);
      }
      write();
    },
  };
}

function glowMaterial(color: string, emissive: number, opacity = 1): MeshStandardMaterial {
  return new MeshStandardMaterial({
    color,
    emissive: new Color(color),
    emissiveIntensity: emissive,
    roughness: 0.4,
    metalness: 0,
    transparent: opacity < 1,
    opacity,
    depthWrite: opacity >= 1,
  });
}

// A plasma wall is a sheet, not a slab: no thickness, lit from inside, seen from either face.
function sheet(w: number, h: number, color: string, opacity: number, emissive: number): Mesh {
  const mesh = new Mesh(new PlaneGeometry(w, h), glowMaterial(color, emissive, opacity));
  mesh.material.side = DoubleSide;
  return mesh;
}

function spread(half: number): number {
  return (Math.random() * 2 - 1) * half;
}

// The star's glare: one soft radial fill that the obstacles pass in front of.
function glareTexture(): CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 256;
  const g = canvas.getContext('2d')!;
  const gradient = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.3, 'rgba(255,255,255,0.3)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gradient;
  g.fillRect(0, 0, 256, 256);
  const tex = new CanvasTexture(canvas);
  tex.colorSpace = SRGBColorSpace;
  return tex;
}

// The beat sheet's reduced-motion rule: the idle bob goes, nothing else changes.
function characterConfig(): CharacterConfig {
  if (!prefersReducedMotion()) return CONFIG;
  return { ...CONFIG, view: { ...CONFIG.view, idleBob: false } };
}
