# Ghost Particle — what it is and how it was built

Live at https://ghost-particle.exe.xyz/. Source: github.com/jazz-hands/ghost-particle.

## The app

Ghost Particle is a short browser game, about six minutes, that teaches what a neutrino is by letting you be one. You ride a single neutrino from its birth in the Sun's core to the moment a detector under a mountain in Japan finally sees it. The whole game is one joke with a payoff: you touch nothing, level after level, until in the detector you hit one electron, and that hit is how humans see neutrinos at all.

Six levels, each one scene and one mechanic:

1. **Birth.** Wordless. Hold Space to squeeze two nuclei together; a flash, a wobbling nucleus, a pop, and the neutrino blinks into existence under the title.
2. **Meet the neutrino.** Four short cards over a seesaw gag: weighed against an electron, the neutrino floats up. What it is, how light it is, that it has no charge, and where it came from.
3. **Escaping the Sun.** You rush outward through plasma and are told to try to hit something. You steer into walls and knots of nuclei and pass through every one. Halfway out your colour starts changing: neutrinos come in three flavors and switch between them, which is how we know they have mass. You burst out of the Sun into space.
4. **The trip to Earth.** A travel meter in kilometres and light-seconds. Halfway there the Standard Model builds itself one family at a time, colour-coded, and you find yourself among the leptons. Then a dash to Earth and a dive through clouds into the Kamioka mine.
5. **Super-Kamiokande.** A tank of 50,000 tons of water lined with 11,129 gold light sensors. The hero's hit: you press Space, kick an electron faster than light moves in water, and a fuzzy ring of light paints itself on the wall. Then you are the physicist: five more rings, sharp or fuzzy, sorted with E and M.
6. **The Sun in neutrinos.** The screen goes black and thousands of tinted dots land, each one a detected neutrino placed by its direction, until the Sun emerges from the noise and brightens into a glow. A counter shows how many neutrinos passed through your own body since you pressed start. Credits.

Everything on screen is sourced. A single facts file (`docs/FACTS.md`) holds every number, formula and image credit with its reference, 34 entries, and the code references them by ID; a checker fails the test suite if code cites a fact that is not documented. The two things that are simulated rather than recorded, the detector rings and the sky map, say so in the credits, and the flavor colours are declared a design choice.

Technical shape: TypeScript, Vite, three.js, no framework, no runtime dependencies beyond three.js. One renderer, one scene graph, levels swapped in and out. Captions, meters and buttons are DOM overlays, not 3D text. Sound is synthesized with the Web Audio API, no audio files. The character is one sphere with a canvas-painted skin; all eleven expressions are eye redraws plus squash and stretch. The build is 720 KB including the self-hosted font, served by nginx on an exe.dev VM. Tests: 59 unit tests on Node's built-in runner and 5 Playwright end-to-end tests in headless Chromium with software WebGL, one screenshot per level.

## The workflow

The whole thing, from the first line of app code to the public URL, was one day: about 130 commits on 2026-09-12 and 13, about 4,700 lines of TypeScript across 31 files, with Jasmine directing and Claude Code building.

**Docs were the spec.** Before any code, four documents were the authority: decisions (the rules, numbered D-xxx), facts (every claim with a source, F-xx), the spec (what and why), and the beat sheet (moment by moment: what the player sees, does, what the character does, the caption, its fact IDs, the sound). The standing rule was "if it isn't in the beat sheet, it isn't built", and every content change during the day went into the beat sheet in the same commit as the code.

**Scaffold, then blockout, then review, then polish.**

- *Scaffold* (evening of the 12th): Vite shell, level manager, a facts mirror with its checker, the debug hook `window.ghost` so tests can step the game, Playwright smoke tests.
- *Blockout* (34 minutes of a 90-minute cap): every beat of every level playable in grey primitives with the real camera paths, captions, inputs and timings, so the game could be played end to end before any art. The shared infrastructure was built first by one agent; then three agents built the six levels in parallel, each in its own git worktree with a circuit breaker: a cap on tool calls and minutes, commit or revert before stopping, and an order to stop and report rather than work around any need to touch shared code. Each level pair merged to main as it landed with the check suite run on main.
- *Review* (level by level): Jasmine played each level from a dev server and gave notes; each level's fixes went on its own branch and merged on approval. This is where the game changed most: a measure-your-flavor beat was cut, the Standard Model grew a family-by-family build with its own sounds, the level 6 chart became the Sun of dots, and every caption got a pass for a reader with no physics.
- *Polish* (one agent per level, in parallel where the files allowed): the real character with its reactions, synthesized sound, palettes, materials, instanced sensors, rings painted on a canvas texture. Each landed with its own tests, merged to main with conflicts resolved in the shared audio module by hand.
- *Ship*: full suite green, screenshots refreshed, worktrees and branches pruned, a VM created, nginx configured, `npm run deploy` added, made public.
- *After the first play-tester*: an autoplay pass, where cards timed out on their own, was reverted the same day because the screens moved too fast to read. Cards now wait for Space with a clear "Space to continue", the Standard Model families each got a full card, wrong picks stopped wiggling and the neutrino tiles shake as a hint after two misses, and the final counter spells out what its number is. Each round went live within minutes with `npm run deploy`.

**Rules that held all day.** Small conventional commits, one logical change each, every commit run through typecheck, facts check and unit tests first. Plan before touching more than two files. No dependency added without saying what it pulls in; the only one added all day was a 24 KB font under the SIL Open Font License. Files describe current state only. Visual checks were Jasmine's: a screenshot and a link, at most two attempts on any visual issue before handing it over. Facts stayed in one file, and the checker kept the code honest.

**What is parked.** One ring in level 5 that should fold onto the tank's cap rather than end at the wall's edge; two facts marked "check" that want a second look at their sources; narration, sketched with the Web Speech API but not built for lack of time.
