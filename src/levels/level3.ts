import { Color, FogExp2, Group } from 'three';
import type { Object3D } from 'three';
import { cycleFlavor } from '../content/flavors.ts';
import type { Flavor } from '../content/flavors.ts';
import { GREY, box, disposeGroup, neutrino, plane, sphere, tint } from '../render/prims.ts';
import { scriptedLevel } from './scripted.ts';

const LANE = 2;
const STEER = 3;
const RAIL = 12;
const SPAWN_Z = -60;
const HALT_Z = -5;
const SURFACE = '#c9d2da';

interface Obstacle {
  object: Object3D;
  passed: boolean;
  halts: boolean;
}

export const createLevel3 = scriptedLevel(3, async (s) => {
  const ghost = neutrino();
  s.group.add(ghost);

  const stageBackground = s.scene.background;
  const base = stageBackground instanceof Color ? stageBackground.clone() : new Color('#000000');
  const surface = new Color(SURFACE);
  const sky = new Color().copy(base);
  const fog = new FogExp2(GREY, 0.05);
  s.scene.fog = fog;

  const obstacles: Obstacle[] = [];
  let lane = 0;
  let tally = 0;
  let follow = true;
  let spawning = false;
  let spawnIn = 0;
  let cycling = false;
  let shown: Flavor | null = null;
  let dawn = 0;
  let rising = false;
  let steered = false;

  const add = (object: Object3D, halts = false): void => {
    object.position.z = SPAWN_Z;
    s.group.add(object);
    obstacles.push({ object, passed: false, halts });
  };

  const plasmaWall = (gap: boolean): Object3D => {
    if (!gap) return plane(12, 8, { opacity: 0.5 });
    const wall = new Group();
    for (const side of [-1, 1]) {
      const half = box(5, 8, 0.2, { opacity: 0.5 });
      half.position.x = side * 3.5;
      wall.add(half);
    }
    return wall;
  };

  const knot = (): Object3D => {
    const cluster = new Group();
    for (let i = 0; i < 8; i += 1) {
      const bead = sphere(0.25);
      bead.position.set((Math.random() * 2 - 1) * 1.2, (Math.random() * 2 - 1) * 1.2, (Math.random() * 2 - 1) * 1.2);
      cluster.add(bead);
    }
    cluster.position.x = (Math.random() * 2 - 1) * LANE;
    return cluster;
  };

  const wallOfLight = (): Object3D => plane(12, 8, { opacity: 0.9, color: '#d0d6dc' });

  // Some have gaps, most don't (3.4).
  const nextObstacle = (): Object3D => {
    const roll = Math.random();
    if (roll < 0.35) return knot();
    if (roll < 0.55) return plasmaWall(true);
    if (roll < 0.85) return plasmaWall(false);
    return wallOfLight();
  };

  s.onUpdate((dt) => {
    if (s.keys.isDown('ArrowLeft')) { lane -= STEER * dt; steered = true; }
    if (s.keys.isDown('ArrowRight')) { lane += STEER * dt; steered = true; }
    lane = Math.min(Math.max(lane, -LANE), LANE);
    ghost.position.x = lane;
    if (follow) s.rig.set({ x: lane * 0.5, y: 0.5, z: 6 }, { x: ghost.position.x, y: ghost.position.y - 0.6, z: 0 });

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
        s.hud.prompt('Arrow keys to steer');
        continue;
      }
      o.object.position.z += RAIL * dt;
      if (!o.passed && o.object.position.z >= 0) {
        o.passed = true;
        tally += 1;
        s.hud.sub([`Passed through: ${tally}`]);
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
        tint(ghost, f);
        s.hud.flavor(f);
      }
    }

    if (rising && dawn < 1) {
      dawn = Math.min(dawn + dt / 6, 1);
      s.scene.background = sky.copy(base).lerp(surface, dawn);
      fog.color.copy(sky);
    }
  });

  await s.hud.fade(0, 0.5);

  await s.b.card("You're leaving the Sun. Everything in here is packed tight. Try to hit something. Arrow keys to steer.");

  for (const gap of [false, true]) {
    steered = false;
    add(plasmaWall(gap), true);
    const before = tally;
    await s.b.until(() => tally > before);
    s.hud.prompt(null);
  }

  await s.b.card('Nothing happened. The Sun is opaque to light, but almost transparent to you. Almost nothing can stop a neutrino.', ['F-10']);

  spawning = true;
  spawnIn = 1;
  await s.b.wait(9);

  fog.density = 0.03;
  await s.b.card('Light from the core takes tens of thousands of years or more to get out. It keeps bumping into things. You take about 2 seconds.', ['F-08', 'F-09']);
  await s.b.wait(9);

  cycling = true;
  await s.b.card("Neutrinos come in three flavors: electron, muon, and tau. You were born electron-flavor. But look. You're changing.", ['F-12']);

  await s.b.card("A neutrino can only change flavor if it has some mass. That's how we know you aren't weightless.", ['F-05']);

  spawning = false;
  rising = true;
  await s.b.card('Of boron-8 neutrinos born electron-flavor like you, only about a third still look that way when they reach Earth.', ['F-14']);

  // 3.9: out of the surface into black space, the Sun glaring behind.
  s.scene.fog = null;
  s.scene.background = stageBackground;
  const sun = sphere(8);
  sun.position.set(0, 0, 30);
  s.group.add(sun);
  follow = false;
  await s.rig.moveTo({ x: 0, y: 0.8, z: 2 }, { x: 0, y: 0, z: 30 }, 1.5);
  s.hud.big(`Passed through: ${tally}`, 2);
  await s.b.wait(2);
});
