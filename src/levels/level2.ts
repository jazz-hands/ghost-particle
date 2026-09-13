import { Group, MeshPhysicalMaterial } from 'three';
import type { Mesh, Object3D } from 'three';
import { box, disposeGroup, setOpacity, sphere } from '../render/prims.ts';
import { scriptedLevel } from './scripted.ts';
import { createNeutrino } from '../character/neutrino.ts';
import { setCurrentNeutrino } from '../character/current.ts';
import { CONFIG } from '../character/config.ts';

const ARM = 1.5;
const PLANK_Y = -0.8;
// The electron end goes down, so the plank turns the opposite way to the beat sheet's -25 degrees.
const TILT = (25 * Math.PI) / 180;
const SEAT = 0.525;
const RISE = 0.6;
// The character's body sphere has radius 1; the blockout's ghost was half that.
const CHARACTER_SCALE = 0.5;
// 2.3's brighten rides the character's own emissive, not a HUD flash.
const GLOW_PEAK = 2.4;
const GLOW_SECONDS = 1;

export const createLevel2 = scriptedLevel(2, async (s) => {
  const anims: ((dt: number) => boolean)[] = [];
  s.onUpdate((dt) => {
    for (let i = anims.length - 1; i >= 0; i -= 1) if (anims[i]!(dt)) anims.splice(i, 1);
  });
  const tween = (seconds: number, fn: (u: number) => void): void => {
    let t = 0;
    anims.push((dt) => {
      t = Math.min(t + dt, seconds);
      const u = t / seconds;
      fn(u * u * (3 - 2 * u));
      return t >= seconds;
    });
  };

  const ghost = createNeutrino(CONFIG);
  ghost.group.scale.setScalar(CHARACTER_SCALE);
  setCurrentNeutrino(ghost);
  s.group.add(ghost.group);
  // exit() clears the level group, and three.js announces that to each child: the only
  // teardown hook a scripted level gets.
  ghost.group.addEventListener('removed', () => {
    setCurrentNeutrino(null);
    ghost.dispose();
  });
  // F-12: the hero is still electron-flavor here; it only starts changing in level 3.
  ghost.setFlavor('electron');
  s.onUpdate((dt) => ghost.update(dt));
  const skin = bodyMaterials(ghost.group);

  s.rig.set({ x: 0, y: 0.3, z: 6.5 }, { x: 0, y: 0, z: 0 });
  void s.rig.moveTo({ x: 0, y: 0.3, z: 11 }, { x: 0, y: -0.6, z: 0 }, 2);

  // 2.1
  s.hud.counter.start();
  s.hud.counter.setVisible(true);
  ghost.react('wiggle');
  await s.b.card(
    'Meet a neutrino. Born a moment ago in the Sun\'s core, where it\'s about 15 million degrees.',
    ['F-03'],
  );

  // 2.2
  const seesaw = new Group();
  const pivot = box(0.2, 0.4, 0.4);
  pivot.position.set(0, PLANK_Y - 0.225, 0);
  const plank = box(3, 0.05, 0.4);
  plank.position.set(0, PLANK_Y, 0);
  const electron = sphere(0.12, { opacity: 1 });
  electron.position.set(-ARM + 0.15, 0.145, 0);
  plank.add(electron);
  seesaw.add(pivot, plank);
  s.group.add(seesaw);

  const parts: Mesh[] = [pivot, plank, electron];
  for (const part of parts) setOpacity(part, 0);
  const seatX = ARM - 0.15;
  tween(0.5, (u) => {
    for (const part of parts) setOpacity(part, u);
    ghost.group.position.set(seatX * u, PLANK_Y * u + SEAT * u, 0);
  });
  await s.b.wait(0.5);

  const restY = PLANK_Y + SEAT;
  const upX = Math.cos(TILT) * seatX;
  const upY = PLANK_Y + Math.sin(TILT) * seatX + SEAT + RISE;
  ghost.react('shrug');
  tween(0.6, (u) => {
    plank.rotation.z = TILT * u;
    ghost.group.position.set(seatX + (upX - seatX) * u, restY + (upY - restY) * u, 0);
  });
  await s.b.card(
    'It has almost no mass. Weighed against an electron, it\'s over a million times lighter.',
    ['F-04'],
  );

  // 2.3
  tween(0.5, (u) => {
    for (const part of parts) setOpacity(part, 1 - u);
  });
  tween(GLOW_SECONDS, (u) => {
    for (const m of skin) m.emissiveIntensity = 1 + (GLOW_PEAK - 1) * Math.sin(u * Math.PI);
  });
  await s.b.wait(0.5);
  disposeGroup(seesaw);
  ghost.react('cheer');
  await s.b.card(
    'No electric charge. Most solar neutrinos come from two protons squeezed together; you came from a rarer squeeze, with extra energy a detector can catch.',
    ['F-06', 'F-01', 'F-02'],
  );

  // 2.4
  await s.hud.fade(1, 0.8);
});

// The brighten is the body's own material; the rim shell and halo are basic materials and
// carry no emissive.
function bodyMaterials(root: Object3D): MeshPhysicalMaterial[] {
  const list: MeshPhysicalMaterial[] = [];
  root.traverse((child) => {
    const m = (child as Partial<Mesh>).material;
    if (m instanceof MeshPhysicalMaterial) list.push(m);
  });
  return list;
}
