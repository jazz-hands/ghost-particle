import { AdditiveBlending, ConeGeometry, Color, Mesh, MeshBasicMaterial, SphereGeometry } from 'three';
import { scriptedLevel } from './scripted.ts';
import type { Scripted } from './scripted.ts';
import { CHERENKOV_BLUE, H_TANK, WALL, createTank } from './level5-tank.ts';
import type { PaintedRing, RingStyle } from './level5-tank.ts';
import { createNeutrino } from '../character/neutrino.ts';
import { setCurrentNeutrino } from '../character/current.ts';
import { CONFIG } from '../character/config.ts';
import type { CharacterConfig } from '../character/config.ts';
import { prefersReducedMotion } from '../render/rig.ts';

// F-31: cos θ = 1/(nβ) gives 41.2° in water, so a cone of height h has base radius h × tan θ.
const CHERENKOV = Math.tan((41.2 * Math.PI) / 180);

// The eye sits across the tank from the hit, not beside it: at the stage's 26-degree lens a
// ring on the far wall only fits in frame from about six units back.
const EYE: [number, number, number] = [-2.4, 0.4, -0.9];
const AIM: [number, number, number] = [WALL, -0.3, 0];
const PATH_Y = -0.3;
// The hit runs in the far half of the tank: close enough to the wall that the ring F-31 sizes
// from the electron's reach still fits in frame beside the comparison ring at 5.6.
const NU_X = 2;
const ELECTRON_X = 2.6;
const DRIFT = 0.1;
const ELECTRON_SPEED = 3;
const RING_IN = 0.35;
const GLINT_Y = 0.5;
// The character's body sphere has radius 1. Smaller than in levels 1 and 2: here it shares the
// frame with its own ring and must not sit on top of it.
const CHARACTER_SCALE = 0.28;
const NU_POS: [number, number, number] = [NU_X, -0.45, -0.6];
// 5.3 holds its breath: the camera creeps in on the electron while time is slow.
const HELD_EYE: [number, number, number] = [-1.5, 0.2, -0.7];
const HIT_SHAKE = 0.035;

type Answer = 'E' | 'M' | 'either';

interface Spot { theta: number; y: number }

interface RingCase {
  spot: Spot;
  radius: number;
  style: RingStyle;
  answer: Answer;
  reveal: string;
}

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

/** The cone of light itself: open-ended, additive, and pointing the way the electron went. */
function cherenkovCone(radius: number, height: number): Mesh<ConeGeometry, MeshBasicMaterial> {
  const mesh = new Mesh(new ConeGeometry(radius, height, 32, 1, true), new MeshBasicMaterial({
    color: new Color(CHERENKOV_BLUE),
    transparent: true,
    opacity: 0.28,
    blending: AdditiveBlending,
    depthWrite: false,
  }));
  mesh.rotation.z = -Math.PI / 2;
  return mesh;
}

function electronBead(): Mesh<SphereGeometry, MeshBasicMaterial> {
  return new Mesh(new SphereGeometry(0.07, 16, 12), new MeshBasicMaterial({ color: '#e8f6ff' }));
}

// The beat sheet's reduced-motion rule: the idle bob goes, nothing else changes.
function characterConfig(): CharacterConfig {
  if (!prefersReducedMotion()) return CONFIG;
  return { ...CONFIG, view: { ...CONFIG.view, idleBob: false } };
}

export const createLevel5 = scriptedLevel(5, async (s) => {
  const { hud, b, rig, group } = s;
  hud.counter.start();
  hud.counter.setVisible(true);

  const tank = createTank();
  s.scene.fog = tank.fog;
  group.add(tank.group);
  const shown: PaintedRing[] = [];
  const repaint = (): void => tank.paint(shown);

  const ghost = createNeutrino(characterConfig());
  const nu = ghost.group;
  nu.scale.setScalar(CHARACTER_SCALE);
  nu.position.set(...NU_POS);
  // Its painted face is on the body's +Z side, so it turns to keep the player in front of it.
  nu.rotation.y = Math.atan2(EYE[0] - NU_POS[0], EYE[2] - NU_POS[2]);
  setCurrentNeutrino(ghost);
  group.add(nu);
  // exit() clears the level group, and three.js announces that to each child: the only
  // teardown hook a scripted level gets.
  nu.addEventListener('removed', () => {
    setCurrentNeutrino(null);
    ghost.dispose();
  });
  // F-23: what the detector catches here is an electron-flavor neutrino scattering an electron.
  ghost.setFlavor('electron');
  s.onUpdate((dt) => ghost.update(dt));

  // 5.1 the tank fades up while the camera tilts down the full height of the cylinder, from
  // the top cap to the sensor wall ahead.
  rig.set(EYE, [0, H_TANK / 2, 0]);
  void rig.moveTo(EYE, AIM, 5);
  void hud.fade(0, 3);
  ghost.react('wake');
  await b.card('Super-Kamiokande. A tank 39 meters wide and 41 meters tall, holding 50,000 tons of pure water. Running since 1996.', ['F-17', 'F-19']);

  // 5.2 a glint runs round the sensor wall, lighting each stretch as it passes.
  ghost.react('peek');
  void animate(s, 3, (u) => {
    const theta = Math.PI / 2 - u * Math.PI * 2;
    shown[0] = { theta, y: GLINT_Y, radius: 0, style: 'fuzzy', alpha: u === 1 ? 0 : 0.9 };
    repaint();
    if (u === 1) shown.length = 0;
  });
  await b.card('11,129 light sensors line the inside, waiting for a flash. About 30 neutrinos a day give them one.', ['F-18', 'F-20']);

  // 5.3 a lone electron drifts ahead until the player takes the shot.
  const electron = electronBead();
  electron.position.set(ELECTRON_X, PATH_Y, 0);
  group.add(electron);
  let drifting = true;
  s.onUpdate((dt) => { if (drifting) electron.position.x += DRIFT * dt; });
  hud.prompt('Press Space');
  ghost.react('brace');
  void rig.moveTo(HELD_EYE, AIM, 6);
  await b.key('Space');
  drifting = false;
  hud.prompt(null);
  void rig.moveTo(EYE, AIM, 0.8);

  // 5.4 the nudge, the cone, and the ring it paints on the wall.
  const from = electron.position.x;
  const reach = WALL - from;
  const lunge = 0.35 / Math.hypot(from - NU_POS[0], PATH_Y - NU_POS[1], -NU_POS[2]);
  await animate(s, 0.3, (u) => {
    nu.position.set(
      NU_POS[0] + (from - NU_POS[0]) * lunge * u,
      NU_POS[1] + (PATH_Y - NU_POS[1]) * lunge * u,
      NU_POS[2] * (1 - lunge * u),
    );
  });
  const light = cherenkovCone(reach * CHERENKOV, reach);
  light.position.set(from, PATH_Y, 0);
  group.add(light);
  const hero: PaintedRing = { theta: 0, y: PATH_Y, radius: reach * CHERENKOV, style: 'fuzzy', alpha: 0 };
  shown.push(hero);
  await animate(s, reach / ELECTRON_SPEED, (u) => {
    electron.position.x = from + reach * u;
    light.scale.setScalar(Math.max(u, 0.001));
    light.position.x = from + (reach * u) / 2;
    hero.alpha = u * u;
    repaint();
  });
  electron.visible = false;
  ghost.react('surprised');
  rig.shake(HIT_SHAKE);
  await animate(s, RING_IN, (u) => {
    rig.shake(HIT_SHAKE * (1 - u));
    hero.alpha = 1;
    light.material.opacity = 0.28 * (1 - u);
    repaint();
  });
  light.visible = false;
  rig.shake(0);
  ghost.react('proud');

  await b.card('You hit something. You kicked an electron faster than light moves in water. That makes a cone of light. On the wall: a ring.', ['F-21', 'F-31']);

  // 5.6 a sharp ring for comparison, beside the player's fuzzy one.
  const rival: PaintedRing = { theta: 0.62, y: PATH_Y, radius: reach * CHERENKOV * 0.8, style: 'sharp', alpha: 0 };
  shown.push(rival);
  void animate(s, RING_IN, (u) => { rival.alpha = u; repaint(); });
  ghost.react('look-at-self');
  await b.card('Your ring is fuzzy, because the electron scatters and showers. A muon would punch straight through and leave a sharp ring.', ['F-22']);

  // 5.7 the sorting game.
  let picked: 'E' | 'M' | null = null;
  let accepting = false;
  const buttons = hud.buttons([{ key: 'E', label: 'Electron' }, { key: 'M', label: 'Muon' }], (key) => {
    if (accepting && (key === 'E' || key === 'M')) picked = key;
  });
  ghost.react('nod');
  await b.card("Now you're the physicist. Five more rings are coming. Sharp or fuzzy? Press E or M to sort them.", ['F-22']);

  // 5.8, 5.9 five rings, one at a time, each answered and then explained.
  shown.length = 0;
  repaint();
  for (const item of RINGS) {
    const painted: PaintedRing = { ...item.spot, radius: item.radius, style: item.style, alpha: 0 };
    shown.push(painted);
    void animate(s, RING_IN, (u) => { painted.alpha = u; repaint(); });
    void rig.moveTo(EYE, wallPoint(item.spot), 0.8);
    ghost.react('peek');
    picked = null;
    accepting = true;
    await b.until(() => picked !== null);
    accepting = false;
    ghost.react(item.answer === 'either' || picked === item.answer ? 'nod' : 'shrug');
    hud.reveal(item.reveal, 3);
    await b.wait(3);
    shown.length = 0;
    repaint();
  }
  buttons.close();
  void rig.moveTo(EYE, AIM, 0.8);

  ghost.react('nod');
  await b.card("Solar neutrinos show up as electron rings pointing away from the Sun. That's how Super-K knows they came from the Sun.", ['F-23']);
  await b.card("These rings are simulated from Super-K's published shape and physics. They are not real recordings.", ['F-24', 'F-17', 'F-18'], { small: true });
});
