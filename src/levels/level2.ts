import { Color, Group, MeshPhysicalMaterial, MeshStandardMaterial } from 'three';
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
// The electron end is all but down by here; the pop lands with the impact, not after it.
const SLAM_AT = 0.92;
// 2.3's brighten rides the character's own emissive, not a HUD flash.
const GLOW_PEAK = 2.6;
const GLOW_SECONDS = 1;

// The warm haze the beat sheet floats the neutrino in: level 1's amber family, two faint
// shells behind the character so the wash has some falloff. Level-owned; Stage is untouched.
const HAZE_AMBER = '#ff9f45';
const HAZE_Z = -2.2;
const HAZE_SHELLS: [radius: number, opacity: number, emissive: number][] = [
  [2.4, 0.08, 0.5],
  [4.2, 0.04, 0.35],
];
// Furniture, not a character: a muted cool grey-blue, smooth and a little glossy.
const PLANK_BLUE = '#8ea6c4';
const PIVOT_BLUE = '#6d8299';
const TOY_ROUGHNESS = 0.25;
const TOY_METALNESS = 0.05;
// The electron reads as a bright cool bead against the amber haze.
const ELECTRON_BLUE = '#6aa8ff';
const ELECTRON_EMISSIVE = 1.2;

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

  for (const [radius, opacity, emissive] of HAZE_SHELLS) {
    s.group.add(haze(radius, opacity, emissive));
  }

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
  s.cues.blip();
  s.cues.startTicking();
  await s.b.card(
    'Meet a neutrino. Born a moment ago in the Sun\'s core, where it\'s about 15 million degrees.',
    ['F-03'],
  );

  // 2.2
  const seesaw = new Group();
  const pivot = toy(box(0.2, 0.4, 0.4, { color: PIVOT_BLUE }));
  pivot.position.set(0, PLANK_Y - 0.225, 0);
  const plank = toy(box(3, 0.05, 0.4, { color: PLANK_BLUE }));
  plank.position.set(0, PLANK_Y, 0);
  const electron = toy(sphere(0.12, { color: ELECTRON_BLUE }), ELECTRON_EMISSIVE);
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
  let slammed = false;
  tween(0.6, (u) => {
    plank.rotation.z = TILT * u;
    ghost.group.position.set(seatX + (upX - seatX) * u, restY + (upY - restY) * u, 0);
    if (slammed || u < SLAM_AT) return;
    slammed = true;
    s.cues.pop();
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
  s.cues.chime();
  await s.b.card(
    'No electric charge. Most solar neutrinos come from two protons squeezed together; you came from a rarer squeeze, with extra energy a detector can catch.',
    ['F-06', 'F-01', 'F-02'],
  );

  // 2.4
  s.cues.stopTicking();
  s.cues.whoosh();
  await s.hud.fade(1, 0.8);
});

function haze(radius: number, opacity: number, emissive: number): Mesh {
  const mesh = sphere(radius, { color: HAZE_AMBER, opacity });
  const material = mesh.material as MeshStandardMaterial;
  material.emissive = new Color(HAZE_AMBER);
  material.emissiveIntensity = emissive;
  material.roughness = 1;
  material.depthWrite = false;
  mesh.position.z = HAZE_Z;
  mesh.renderOrder = -1;
  return mesh;
}

// Toy-like: smooth, slightly glossy (SPEC "Look and feel").
function toy(mesh: Mesh, emissive = 0): Mesh {
  const material = mesh.material as MeshStandardMaterial;
  material.roughness = TOY_ROUGHNESS;
  material.metalness = TOY_METALNESS;
  if (emissive > 0) {
    material.emissive = new Color(material.color);
    material.emissiveIntensity = emissive;
  }
  return mesh;
}

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
