import { Group } from 'three';
import type { Mesh } from 'three';
import { box, disposeGroup, neutrino, setOpacity, sphere } from '../render/prims.ts';
import { scriptedLevel } from './scripted.ts';

const ARM = 1.5;
const PLANK_Y = -0.8;
// The electron end goes down, so the plank turns the opposite way to the beat sheet's -25 degrees.
const TILT = (25 * Math.PI) / 180;
const SEAT = 0.525;
const RISE = 0.6;

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

  const ghost = neutrino();
  s.group.add(ghost);
  s.rig.set({ x: 0, y: 0.3, z: 6.5 }, { x: 0, y: 0, z: 0 });
  void s.rig.moveTo({ x: 0, y: 0.3, z: 11 }, { x: 0, y: -0.6, z: 0 }, 2);

  // 2.1
  s.hud.counter.start();
  s.hud.counter.setVisible(true);
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
    ghost.position.set(seatX * u, PLANK_Y * u + SEAT * u, 0);
  });
  await s.b.wait(0.5);

  const restY = PLANK_Y + SEAT;
  const upX = Math.cos(TILT) * seatX;
  const upY = PLANK_Y + Math.sin(TILT) * seatX + SEAT + RISE;
  tween(0.6, (u) => {
    plank.rotation.z = TILT * u;
    ghost.position.set(seatX + (upX - seatX) * u, restY + (upY - restY) * u, 0);
  });
  await s.b.card(
    'It has almost no mass. Weighed against an electron, it\'s over a million times lighter.',
    ['F-04'],
  );

  // 2.3
  tween(0.5, (u) => {
    for (const part of parts) setOpacity(part, 1 - u);
  });
  tween(1, (u) => {
    setOpacity(ghost, 0.45 + 0.35 * Math.sin(u * Math.PI));
  });
  await s.b.wait(0.5);
  disposeGroup(seesaw);
  await s.b.card(
    'No electric charge. Most solar neutrinos come from two protons squeezed together; you came from a rarer squeeze, with extra energy a detector can catch.',
    ['F-06', 'F-01', 'F-02'],
  );

  // 2.4
  await s.hud.fade(1, 0.8);
});
