import { Color, Vector3 } from 'three';
import { scriptedLevel } from './scripted.ts';
import type { Scripted } from './scripted.ts';
import { createNeutrino } from '../character/neutrino.ts';
import { setCurrentNeutrino } from '../character/current.ts';
import { CONFIG } from '../character/config.ts';
import type { CharacterConfig } from '../character/config.ts';
import { prefersReducedMotion } from '../render/rig.ts';
import { FACTS } from '../content/facts.ts';
import { FIELD_DEGREES } from '../content/skymap.ts';
import { GLOW_SECONDS, createFill } from './level6-field.ts';

// 6.1: the tank fades to black and stays there, so the field's transparent canvas has nothing
// but the level's own objects behind it. scripted.ts hands the stage colour back on exit.
const FIELD_BLACK = '#000000';
// 6.4: the counter stops on a tick and the number is confirmed by a chime once it has grown.
const FREEZE_CHIME_AFTER = 0.9;
const COUNTER_SECONDS = 4;
// 6.5: the character sees the player off from the lower right of whatever view the credits
// arrive in. It is placed along a line out of the camera, so the camera itself never moves.
const GOODBYE_NDC = { x: 0.72, y: -0.6 };
const GOODBYE_DEPTH = 7;
// The character's body sphere has radius 1; the blockout's ghost was half that.
const CHARACTER_SCALE = 0.5;
const WAVE_EVERY = 4;

function creditLines(): string[] {
  const facts = Object.values(FACTS).flatMap((fact) => [`${fact.id} ${fact.title}`, ...fact.sources]);
  return [
    'Ghost Particle',
    '## Facts and sources',
    ...facts,
    '## Made with',
    'three.js, Vite, TypeScript, Playwright',
    '## The small print',
    'The flavor colours are a design choice with no physical meaning (D-011).',
    'The Sun-in-neutrinos map is simulated from the scattering physics (F-34); it is not the 1998 Super-Kamiokande image.',
    'Assumes an adult of 150 lb and 5 ft 7 in standing and facing the Sun. Turn sideways and the number drops; it is a rough figure.',
  ];
}

export const createLevel6 = scriptedLevel(6, async (s) => {
  const { hud, b, cues } = s;
  hud.counter.start();
  hud.counter.setVisible(true);

  await hud.fade(1, 1);
  s.scene.background = new Color(FIELD_BLACK);

  // 6.1: the whole view is the field; it fills with event directions until the Sun stands out.
  const map = hud.skymap({
    degrees: FIELD_DEGREES,
    note: 'Simulated from the scattering physics (F-34); not the real 503-day map.',
    credit: 'After the Super-Kamiokande solar neutrino sky map (F-25).',
  });
  const fill = createFill();
  s.onUpdate((dt) => {
    if (fill.done) return;
    const batch = fill.advance(dt);
    cues.fieldHum(fill.progress);
    if (batch.length === 0) return;
    map.drop(batch);
    if (fill.rush > 0) cues.batchTick(fill.rush);
  });
  await hud.fade(0, 1);
  await b.until(() => fill.done);
  await b.wait(1);

  // 6.2, 6.3
  cues.chime();
  await b.card('This is the Sun, seen in neutrinos. It took 503 days of watching. Some of these neutrinos arrived at night, after passing through the entire Earth.', ['F-25']);
  await b.card('Nothing stopped them. Nothing stopped you.', ['F-10']);
  cues.fieldHum(null);
  cues.swell(GLOW_SECONDS);
  await map.glow(GLOW_SECONDS);

  // 6.4: the through-line counter stops and grows.
  hud.counter.freezeLarge();
  cues.tick();
  hud.note('And through you, since you pressed start:', ['F-32']);
  await b.wait(FREEZE_CHIME_AFTER);
  cues.chime();
  await b.wait(COUNTER_SECONDS - FREEZE_CHIME_AFTER);

  // 6.5: credits, Play again reloads.
  hud.note(null);
  hud.counter.setVisible(false);
  cues.tada();
  hud.credits(creditLines(), () => { location.assign(location.pathname); });
  goodbye(s);
  await b.key('Space');
});

// The character comes back for the credits: small, beside the button, waving every few seconds.
function goodbye(s: Scripted): void {
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
  const { camera } = s.ctx;
  const aim = new Vector3(GOODBYE_NDC.x, GOODBYE_NDC.y, 0.5).unproject(camera).sub(camera.position).normalize();
  ghost.group.position.copy(camera.position).addScaledVector(aim, GOODBYE_DEPTH);
  ghost.group.quaternion.copy(camera.quaternion);

  let since = WAVE_EVERY;
  s.onUpdate((dt) => {
    ghost.update(dt);
    since += dt;
    if (since < WAVE_EVERY) return;
    since = 0;
    ghost.react('wave');
  });
}

// The beat sheet's reduced-motion rule: the idle bob goes, nothing else changes.
function characterConfig(): CharacterConfig {
  if (!prefersReducedMotion()) return CONFIG;
  return { ...CONFIG, view: { ...CONFIG.view, idleBob: false } };
}
