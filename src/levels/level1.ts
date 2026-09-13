import { disposeGroup, neutrino, setOpacity, sphere } from '../render/prims.ts';
import type { Mesh } from 'three';
import { scriptedLevel } from './scripted.ts';

const CHARGE_SECONDS = 2.5;
const DRAIN_SECONDS = 0.8;
const BOUNCE_SECONDS = 0.5;
const SPARK_COUNT = 12;
const SPARK_SECONDS = 0.8;
const APART = 3;
const TOGETHER = 0.25;

export const createLevel1 = scriptedLevel(1, async (s) => {
  const glow = sphere(0.35, { opacity: 0.25 });
  s.group.add(glow);

  let charge = 0;
  let glowing = true;
  let pulse = 0;
  s.onUpdate((dt) => {
    if (!glowing) return;
    pulse += dt;
    setOpacity(glow, 0.25 + 0.1 * Math.sin(pulse * 2.4) + 0.3 * charge);
  });

  // 1.1
  await s.b.wait(2);
  s.hud.prompt('Hold Space');
  await s.b.key('Space');

  // 1.2
  s.hud.prompt(null);
  s.hud.counter.start();
  const proton = sphere(0.18);
  proton.position.x = -APART;
  const beryllium = sphere(0.3);
  beryllium.position.x = APART;
  s.group.add(proton, beryllium);

  // 1.3, 1.4
  let charging = true;
  let bounce = 0;
  s.keys.onPress('Space', () => { if (charging) s.hud.prompt(null); });
  s.keys.onRelease('Space', () => {
    if (!charging || charge >= 1) return;
    bounce = 1;
    s.hud.prompt('Hold Space');
  });
  s.onUpdate((dt) => {
    if (!charging) return;
    charge = s.keys.isDown('Space')
      ? Math.min(charge + dt / CHARGE_SECONDS, 1)
      : Math.max(charge - dt / DRAIN_SECONDS, 0);
    bounce = Math.max(bounce - dt / BOUNCE_SECONDS, 0);
    const gap = TOGETHER + (APART - TOGETHER) * (1 - charge) + bounce * 0.6;
    proton.position.x = -gap;
    beryllium.position.x = gap;
  });
  await s.b.until(() => charge >= 1);

  // 1.5
  charging = false;
  glowing = false;
  s.hud.prompt(null);
  s.hud.flash(0.4);
  for (const mesh of [glow, proton, beryllium]) disposeGroup(mesh);

  const nucleus = sphere(0.25);
  s.group.add(nucleus);
  let jittering = true;
  s.onUpdate(() => {
    if (!jittering) return;
    nucleus.position.set(jitter(), jitter(), jitter());
  });
  await s.b.wait(1);
  jittering = false;
  disposeGroup(nucleus);

  // 1.6
  const sparks: Mesh[] = [];
  for (let i = 0; i < SPARK_COUNT; i += 1) {
    const spark = sphere(0.05, { opacity: 0.6 });
    const angle = (i / SPARK_COUNT) * Math.PI * 2;
    spark.userData.dir = [Math.cos(angle), Math.sin(angle) * 0.7, Math.sin(angle * 2) * 0.4];
    sparks.push(spark);
    s.group.add(spark);
  }
  const ghost = neutrino();
  setOpacity(ghost, 0);
  s.group.add(ghost);

  let born = 0;
  s.onUpdate((dt) => {
    if (born >= 1) return;
    born = Math.min(born + dt, 1);
    const u = Math.min(born / SPARK_SECONDS, 1);
    for (const spark of sparks) {
      const dir = spark.userData.dir as number[];
      spark.position.set(dir[0]! * u * 1.8, dir[1]! * u * 1.8, dir[2]! * u * 1.8);
      setOpacity(spark, 0.6 * (1 - u));
    }
    setOpacity(ghost, 0.45 * born);
  });
  await s.b.wait(1);
  for (const spark of sparks) disposeGroup(spark);
  setOpacity(ghost, 0.45);

  // 1.7
  s.hud.title('GHOST PARTICLE');
  s.hud.prompt('Press Space');
  await s.b.key('Space');
  s.hud.title(null);
  s.hud.prompt(null);
});

function jitter(): number {
  return (Math.random() * 2 - 1) * 0.03;
}
