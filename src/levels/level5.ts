import { Group, InstancedMesh, MeshStandardMaterial, Object3D, SphereGeometry } from 'three';
import type { Mesh } from 'three';
import { scriptedLevel } from './scripted.ts';
import type { Scripted } from './scripted.ts';
import { GREY, cone, cylinderInside, neutrino, plane, ring, sphere } from '../render/prims.ts';

// 1 unit = 5 m. F-17: the tank is 39 m wide and 41 m tall.
const R_TANK = 3.9;
const H_TANK = 8.2;
const WALL = 3.85;
const SENSOR_COLUMNS = 40;
const SENSOR_ROWS = 30;
// F-31: cos θ = 1/(nβ) gives 41.2° in water, so a cone of height h has base radius h × tan θ.
const CHERENKOV = Math.tan((41.2 * Math.PI) / 180);
const WHITE = '#ffffff';

const EYE: [number, number, number] = [0, 0.4, -0.9];
const AIM: [number, number, number] = [WALL, -0.3, 0];
const PATH_Y = -0.3;
const ELECTRON_X = 1.5;
const DRIFT = 0.1;
const ELECTRON_SPEED = 6;

type Answer = 'E' | 'M' | 'either';

interface Spot { theta: number; y: number }

interface RingCase {
  spot: Spot;
  radius: number;
  style: 'fuzzy' | 'sharp' | 'ambiguous';
  answer: Answer;
  reveal: string;
}

const STYLES = {
  fuzzy: { tube: 0.15, opacity: 0.4 },
  sharp: { tube: 0.03, opacity: 0.9 },
  ambiguous: { tube: 0.08, opacity: 0.6 },
};

// BEATS.md, "Level 5 ring answers and reveal lines" (F-22). Ring 4 sits near the top rim, which cuts it.
const RINGS: RingCase[] = [
  { spot: { theta: -0.35, y: -0.8 }, radius: 1.0, style: 'fuzzy', answer: 'E', reveal: 'Electron. Blurry edge: an electron, scattering as it goes.' },
  { spot: { theta: 0.34, y: 0.3 }, radius: 1.1, style: 'sharp', answer: 'M', reveal: 'Muon. Crisp edge: a muon, punching straight through.' },
  { spot: { theta: -0.14, y: 1.4 }, radius: 0.9, style: 'fuzzy', answer: 'E', reveal: 'Electron. Soft, smeared ring: an electron shower.' },
  { spot: { theta: 0.2, y: 3.6 }, radius: 0.95, style: 'sharp', answer: 'M', reveal: 'Muon. Clean circle: a muon.' },
  { spot: { theta: -0.26, y: -1.9 }, radius: 1.0, style: 'ambiguous', answer: 'either', reveal: 'Either counts. Hard to call. Physicists flag these too, and some get sorted wrong.' },
];

function animate(s: Scripted, seconds: number, step: (u: number) => void): Promise<void> {
  return new Promise<void>((resolve) => {
    let t = 0;
    s.onUpdate((dt) => {
      if (t >= seconds) return;
      t = Math.min(t + dt, seconds);
      step(t / seconds);
      if (t >= seconds) resolve();
    });
  });
}

function wallPoint(spot: Spot): [number, number, number] {
  return [WALL * Math.cos(spot.theta), spot.y, WALL * Math.sin(spot.theta)];
}

// A ring assembly faces the tank axis: its local +Z points back at the centre.
function ringAt(spot: Spot, radius: number, style: RingCase['style'], dots: number): Group {
  const g = new Group();
  const [x, y, z] = wallPoint(spot);
  g.position.set(x, y, z);
  g.rotation.y = Math.PI / 2 - spot.theta;
  g.add(ring(radius, STYLES[style].tube, { opacity: STYLES[style].opacity }));
  for (let i = 0; i < dots; i++) {
    const a = (i / dots) * Math.PI * 2;
    const dot = sphere(0.06, { color: WHITE });
    dot.position.set(Math.cos(a) * radius, Math.sin(a) * radius, 0.04);
    g.add(dot);
  }
  return g;
}

function sensorWall(): InstancedMesh {
  const count = SENSOR_COLUMNS * SENSOR_ROWS;
  const mesh = new InstancedMesh(new SphereGeometry(0.04), new MeshStandardMaterial({ color: GREY }), count);
  const at = new Object3D();
  let i = 0;
  for (let c = 0; c < SENSOR_COLUMNS; c++) {
    const theta = (c / SENSOR_COLUMNS) * Math.PI * 2;
    for (let r = 0; r < SENSOR_ROWS; r++) {
      const y = -H_TANK / 2 + ((r + 0.5) / SENSOR_ROWS) * H_TANK;
      at.position.set(WALL * Math.cos(theta), y, WALL * Math.sin(theta));
      at.updateMatrix();
      mesh.setMatrixAt(i++, at.matrix);
    }
  }
  return mesh;
}

function endDisc(y: number): Mesh {
  const disc = plane(R_TANK * 2, R_TANK * 2, { opacity: 0.6 });
  disc.rotation.x = Math.PI / 2;
  disc.position.y = y;
  return disc;
}

function yaw(point: [number, number, number], degrees: number): [number, number, number] {
  const a = (degrees * Math.PI) / 180;
  return [point[0] * Math.cos(a) - point[2] * Math.sin(a), point[1], point[0] * Math.sin(a) + point[2] * Math.cos(a)];
}

export const createLevel5 = scriptedLevel(5, async (s) => {
  const { hud, b, rig, group } = s;
  hud.counter.start();
  hud.counter.setVisible(true);

  group.add(cylinderInside(R_TANK, H_TANK, { opacity: 0.6 }), endDisc(H_TANK / 2), endDisc(-H_TANK / 2), sensorWall());

  const nu = neutrino();
  nu.position.set(0.9, PATH_Y + 0.1, 0);
  group.add(nu);

  // 5.1 the tank fades up while the camera pans slowly across the wall.
  rig.set(EYE, AIM);
  void rig.moveTo(EYE, yaw(AIM, 10), 5);
  void hud.fade(0, 3);
  await b.card('Super-Kamiokande. A tank 39 meters wide and 41 meters tall, holding 50,000 tons of pure water. Running since 1996.', ['F-17', 'F-19']);

  // 5.2 one bright marker runs round the sensor wall.
  const marker = sphere(0.15, { color: WHITE });
  marker.position.set(WALL, 0.5, 0);
  group.add(marker);
  void animate(s, 3, (u) => {
    const a = u * Math.PI * 2;
    marker.position.set(WALL * Math.cos(a), 0.5, WALL * Math.sin(a));
    if (u === 1) marker.visible = false;
  });
  await b.card('11,129 light sensors line the inside, waiting for a flash. About 30 neutrinos a day give them one.', ['F-18', 'F-20']);

  // 5.3 a lone electron drifts ahead until the player takes the shot.
  const electron = sphere(0.06);
  electron.position.set(ELECTRON_X, PATH_Y, 0);
  group.add(electron);
  let drifting = true;
  s.onUpdate((dt) => { if (drifting) electron.position.x += DRIFT * dt; });
  hud.prompt('Press Space');
  await b.key('Space');
  drifting = false;
  hud.prompt(null);

  // 5.4 the nudge, the cone, and the ring it paints on the wall.
  const from = electron.position.x;
  const reach = WALL - from;
  await animate(s, 0.3, (u) => { nu.position.x = 0.9 + 0.2 * u; });
  const light = cone(reach * CHERENKOV, reach, { opacity: 0.3 });
  light.rotation.z = Math.PI / 2;
  light.position.set(from, PATH_Y, 0);
  group.add(light);
  await animate(s, reach / ELECTRON_SPEED, (u) => {
    electron.position.x = from + reach * u;
    light.scale.setScalar(Math.max(u, 0.001));
    light.position.x = from + (reach * u) / 2;
  });
  electron.visible = false;
  const hero = ringAt({ theta: 0, y: PATH_Y }, reach * CHERENKOV, 'fuzzy', 12);
  hero.children[0]!.scale.setScalar(1);
  group.add(hero);

  await b.card('You hit something. You kicked an electron faster than light moves in water. That makes a cone of light. On the wall: a ring.', ['F-21', 'F-31']);

  // 5.6 a sharp ring for comparison, beside the player's fuzzy one.
  group.add(ringAt({ theta: 0.62, y: PATH_Y }, reach * CHERENKOV * 0.6, 'sharp', 0));
  await b.card('Your ring is fuzzy, because the electron scatters and showers. A muon would punch straight through and leave a sharp ring.', ['F-22']);

  // 5.7 the sorting game.
  let picked: 'E' | 'M' | null = null;
  let accepting = false;
  const buttons = hud.buttons([{ key: 'E', label: 'Electron' }, { key: 'M', label: 'Muon' }], (key) => {
    if (accepting && (key === 'E' || key === 'M')) picked = key;
  });
  await b.card("Now you're the physicist. Five more rings are coming. Sharp or fuzzy? Press E or M to sort them.", ['F-22']);

  // 5.8, 5.9 five rings, one at a time, each answered and then explained.
  for (const item of RINGS) {
    const mesh = ringAt(item.spot, item.radius, item.style, 0);
    group.add(mesh);
    void rig.moveTo(EYE, wallPoint(item.spot), 0.8);
    picked = null;
    accepting = true;
    await b.until(() => picked !== null);
    accepting = false;
    hud.reveal(item.reveal, 3);
    await b.wait(3);
    mesh.visible = false;
  }
  buttons.close();
  void rig.moveTo(EYE, AIM, 0.8);

  await b.card("Solar neutrinos show up as electron rings pointing away from the Sun. That's how Super-K knows they came from the Sun.", ['F-23']);
  await b.card("These rings are simulated from Super-K's published shape and physics. They are not real recordings.", ['F-24', 'F-17', 'F-18'], { small: true });
});
