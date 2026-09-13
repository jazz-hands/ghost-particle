import { scriptedLevel } from './scripted.ts';
import { FACTS } from '../content/facts.ts';
import { FIELD_DEGREES, sampleEvent, seeded } from '../content/skymap.ts';
import { TINTS } from '../content/flavors.ts';

// The map fills over MAP_SECONDS, slowly at first and faster as it goes, to EVENTS in total (F-34).
const EVENTS = 9000;
const MAP_SECONDS = 9;
const GLOW_SECONDS = 2.5;

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

  // 6.1: the whole view is the field; it fills with event directions until the Sun stands out.
  const map = hud.skymap({
    degrees: FIELD_DEGREES,
    note: 'Simulated from the scattering physics (F-34); not the real 503-day map.',
    credit: 'After the Super-Kamiokande solar neutrino sky map (F-25).',
  });
  const rand = seeded(503);
  let dropped = 0;
  let elapsed = 0;
  s.onUpdate((dt) => {
    if (dropped >= EVENTS) return;
    elapsed = Math.min(elapsed + dt, MAP_SECONDS);
    const u = elapsed / MAP_SECONDS;
    const target = Math.round(EVENTS * u * u);
    const batch = [];
    for (; dropped < target; dropped += 1) {
      const e = sampleEvent(rand);
      batch.push({ x: e.x, y: e.y, color: TINTS[e.flavor] });
    }
    if (batch.length > 0) map.drop(batch);
  });
  await hud.fade(0, 1);
  await b.until(() => dropped >= EVENTS);
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
