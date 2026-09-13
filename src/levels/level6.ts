import { scriptedLevel } from './scripted.ts';
import { neutrino } from '../render/prims.ts';
import { FACTS } from '../content/facts.ts';
import type { ChartPoint } from '../hud/hud.ts';

const DAY = 86_400_000;
const START = Date.UTC(1996, 3, 1);
const END = Date.UTC(2018, 4, 30);
const STEP_DAYS = 5;
const YEAR = 365.25;
// Placeholder stand-in for A-02: mean flux in millions per square centimetre per second,
// modulated by the yearly 1/r² wobble (F-33). The real file is not loaded in the blockout.
const MEAN = 2.3;
const WOBBLE = 0.034;
const PEAK_DAY = 3;
const SIGMA = 0.25;
const ERR = 0.25;
const X0 = 1996 + (START - Date.UTC(1996, 0, 1)) / (YEAR * DAY);

function flux(day: number): number {
  return MEAN * (1 + WOBBLE * Math.cos((2 * Math.PI * (day - PEAK_DAY)) / YEAR));
}

// Seeded so the placeholder chart is the same on every run.
function random(seed: number): () => number {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gaussian(rand: () => number): number {
  return Math.sqrt(-2 * Math.log(1 - rand())) * Math.cos(2 * Math.PI * rand());
}

function series(): ChartPoint[] {
  const rand = random(1996);
  const days = (END - START) / DAY;
  const out: ChartPoint[] = [];
  for (let day = 0; day <= days; day += STEP_DAYS) {
    out.push({ x: X0 + day / YEAR, y: flux(day) + SIGMA * gaussian(rand), err: ERR });
  }
  return out;
}

function creditLines(): string[] {
  const facts = Object.values(FACTS).flatMap((fact) => [`${fact.id} ${fact.title}`, ...fact.sources]);
  return [
    'Ghost Particle',
    'Facts and sources',
    ...facts,
    'Data',
    'Super-Kamiokande Collaboration, Phys. Rev. Lett. 132, 241803 (2024), file sksolartimevariation5804d.txt (A-02)',
    'Made with three.js, Vite, TypeScript, Playwright',
    'The flavor colours are a design choice with no physical meaning (D-011).',
    'Assumes an adult of 150 lb and 5 ft 7 in standing and facing the Sun. Turn sideways and the number drops; it is a rough figure.',
  ];
}

export const createLevel6 = scriptedLevel(6, async (s) => {
  const { hud, b, rig, group } = s;
  hud.counter.start();
  hud.counter.setVisible(true);

  await hud.fade(1, 1);

  const nu = neutrino();
  nu.position.set(2.8, 0, 0);
  group.add(nu);
  rig.set([0, 0, 8], [0.6, 0, 0]);

  const chart = hud.chart(series(), {
    xLabel: 'Year',
    yLabel: "Super-K's measurement (millions per square centimetre per second)",
    credit: 'Super-Kamiokande Collaboration, Phys. Rev. Lett. 132, 241803 (2024), file sksolartimevariation5804d.txt (A-02)',
    note: 'Placeholder data in the blockout; the real file is not loaded yet.',
  });

  await hud.fade(0, 1);
  await chart.draw(6);

  await b.card('This is 22 years of Super-Kamiokande watching the Sun, one dot for every five days. Each dot measures how many neutrinos like you reach Earth.', ['F-24']);
  await b.card('Many of those arrived at night, through the whole Earth. Nothing stopped them. Nothing stopped you.', ['F-25', 'F-10']);
  await b.card("The only pattern in all those years is a gentle yearly wobble, because Earth's orbit is slightly oval.", ['F-33']);
  await chart.curve((x) => flux((x - X0) * YEAR), 2);

  // 6.5 the through-line stops and takes the centre of the screen.
  hud.counter.freezeLarge();
  hud.note('And through you, since you pressed start:', ['F-32']);
  await b.wait(4);

  // 6.6 credits, and the last level ends when the player leaves them.
  hud.note(null);
  chart.close();
  hud.counter.setVisible(false);
  hud.credits(creditLines(), () => { location.assign(location.pathname); });
  await b.key('Space');
});
