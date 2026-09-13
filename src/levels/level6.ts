import { Color } from 'three';
import { scriptedLevel } from './scripted.ts';
import { FACTS } from '../content/facts.ts';
import { FIELD_DEGREES } from '../content/skymap.ts';
import { GLOW_SECONDS, createFill } from './level6-field.ts';

// 6.1: the tank fades to black and stays there, so the field's transparent canvas has nothing
// but the level's own objects behind it. scripted.ts hands the stage colour back on exit.
const FIELD_BLACK = '#000000';

function creditLines(): string[] {
  const facts = Object.values(FACTS).flatMap((fact) => [`${fact.id} ${fact.title}`, ...fact.sources]);
  return [
    'Ghost Particle',
    'Facts and sources',
    ...facts,
    'Made with three.js, Vite, TypeScript, Playwright',
    'The flavor colours are a design choice with no physical meaning (D-011).',
    'The Sun-in-neutrinos map is simulated from the scattering physics (F-34); it is not the 1998 Super-Kamiokande image.',
    'Assumes an adult of 150 lb and 5 ft 7 in standing and facing the Sun. Turn sideways and the number drops; it is a rough figure.',
  ];
}

export const createLevel6 = scriptedLevel(6, async (s) => {
  const { hud, b } = s;
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
    if (batch.length > 0) map.drop(batch);
  });
  await hud.fade(0, 1);
  await b.until(() => fill.done);
  await b.wait(1);

  // 6.2, 6.3
  await b.card('This is the Sun, seen in neutrinos. It took 503 days of watching. Some of these neutrinos arrived at night, after passing through the entire Earth.', ['F-25']);
  await b.card('Nothing stopped them. Nothing stopped you.', ['F-10']);
  await map.glow(GLOW_SECONDS);

  // 6.4: the through-line counter stops and grows.
  hud.counter.freezeLarge();
  hud.note('And through you, since you pressed start:', ['F-32']);
  await b.wait(4);

  // 6.5: credits, Play again reloads.
  hud.note(null);
  hud.counter.setVisible(false);
  hud.credits(creditLines(), () => { location.assign(location.pathname); });
  await b.key('Space');
});
