# Ghost Particle — Spec

A short, on-rails browser game. You ride along with one neutrino from its birth in the Sun's core to a detector under a mountain in Japan, and you learn what a neutrino is by what happens to it on the way.

Playable in a browser, no install, one sitting of roughly 10–15 minutes. The neutrino is the only character on screen.

The moment-by-moment script for every level is `BEATS.md`. This file says what we are building and why; that file says exactly what happens.

## Audience and goals

- Audience: any adult with no physics background. Curious kids welcome.
- Goal 1: the player finishes knowing five things: what a neutrino is, where the Sun's neutrinos come from, why almost nothing stops them, that they come in three "flavors" and can switch, and how a real detector catches them.
- Goal 2: it feels like a playful space toy (Astro Bot energy), not a slideshow. No level is pure reading.
- Non-goals: no human characters, no free roaming, no scoring or leaderboards, no mobile-first layout (desktop keyboard first; touch is a stretch goal).

## Rules that shape everything

See `DECISIONS.md` for the full list. The ones that matter most:

- Every fact, number, formula, and image shown to the player lives in `FACTS.md` with a source, and nowhere else. The spec, beats, captions, and code reference fact IDs (F-xx). Credits render from that file. Nothing invented.
- Plain language. Any technical word is explained the first time it appears.
- One character. The neutrino. No people, no hands, no faces other than the neutrino's.
- Build budget is 4–5 hours. Anything that doesn't fit is cut in the order listed under "Cut order".

## The character

The neutrino is a small, rounded, ghost-like, toy-like character: a slightly squashed translucent sphere with matte dark oval eyes painted into its skin (D-029, mockups in `docs/mockups/`). Simple squash-and-stretch animation. It reacts to captions using a small set of named expressions listed in `BEATS.md`; every expression is a redraw of the eye texture plus a body squash, never extra geometry. It has no arms or legs; motion and eyes carry the personality. Final material, eye, light and bloom values come from `docs/mockups/character-tuner.html` and are recorded in D-029.

The hero is a boron-8 neutrino (D-001, F-02). Flavor is shown as the body's color plus a small icon: electron-flavor, muon-flavor, tau-flavor (D-011). Exact colors are a design decision, not a physics one, and the credits say so.

## The story arc

The whole game is one joke with a payoff: the neutrino touches nothing, level after level, until in the detector it finally hits something, and that hit is how humans see it at all. Every level serves that arc.

## Through-line HUD

One small counter runs from the first key hold in level 1: how many solar neutrinos have passed through the player's own body since then (F-32, D-024). It appears from level 2 onward, shows three significant figures with a word scale, and is frozen and shown large at the end.

## Level progression

Each level is one scene with one mechanic and a handful of captions (at most 40 words each). The player advances on rails; interaction is limited to the level's mechanic plus "continue".

### 1. Birth (wordless)

- Scene: black, quiet, a faint warm glow. Two soft glowing blobs, a proton and a beryllium-7 nucleus, drift toward the center.
- Mechanic: hold a key. A meter fills while held. Release at full: a flash, a wobbling boron-8 nucleus, then it pops and the neutrino blinks into existence.
- Learn (by doing, no text except the key prompt and the title): the Sun makes neutrinos by squeezing nuclei together.
- Facts: F-01, F-02 (visual only; the wording is card 2.3).

### 2. Meet the neutrino (three cards)

- Scene: same dark core, camera pulls back to reveal the neutrino floating in a warm haze.
- Mechanic: press to advance through exactly three cards. Each triggers a reaction. Card two is a seesaw gag: the neutrino is weighed against an electron and floats up.
- Facts: F-03, F-04, F-06, F-01, F-02. The counter (F-32) appears here.
- Optional side panel ("Want more?"): F-26, F-27.

### 3. Escaping the Sun: "try to hit something"

- Scene: rushing outward through layers of dense, bright plasma toward the surface.
- Mechanic: the player is told to try to hit things and can steer left/right into plasma walls, knots of nuclei, and walls of light. The neutrino passes through every one. There is no fail state and no way to collide (D-020).
- Flavor change: as it climbs, the tint shifts between electron, muon, and tau flavor on its own. Captions explain the three flavors and that flavor change proves the neutrino has mass.
- Facts: F-10, F-08, F-09, F-12, F-05, F-14. Side panel: F-13.

### 4. The trip to Earth

- Scene: open space, the Sun shrinking behind, Earth growing ahead. A travel meter shows kilometers and light-seconds covered. Real trip time is compressed to about 40 seconds; holding the right arrow fast-forwards the meter (it never claims the neutrino goes faster than light).
- Mechanic: the Standard Model "family photo" slides in as a grid of tiles with plain one-line labels. The player moves a highlight with the arrow keys and picks the tile that is them with Space; clicking also works (D-021). Wrong tiles wiggle and explain themselves; the right tile makes the neutrino jump in and cheer.
- Facts: F-15, F-16, F-19. Formula F-30 drives the meter.

### 5. Super-Kamiokande

- Scene: dive 1,000 meters underground into a giant cylinder of dark water lined with thousands of glowing gold "eyes" (light sensors).
- Beat one is the hero's own hit (D-022): the neutrino drifts toward a single electron in slow motion, the player presses, the electron shoots forward, a cone of light blooms, and a fuzzy ring appears on the wall. This is the climax of the game.
- Mechanic: then the identification mini-game. Five more rings appear one at a time. Sharp-edged rings were made by muons, fuzzy rings by electrons. The player labels each with the E or M key (buttons also clickable); the answer and a one-line reason are revealed after each (D-013). Feedback only, no fail state.
- Facts: F-17, F-18, F-19, F-20, F-21, F-22, F-23. Formula F-31 sizes the rings.
- Honesty note on screen: rings are simulated from the published detector geometry and ring physics (F-24). They are not real event records.

### 6. Twenty-two years of watching

- Scene: the tank fades to black and a chart draws itself in: Super-Kamiokande's public solar neutrino record, one point for every five days from 1996 to 2018 (A-02, F-24). The neutrino floats beside it. The chart is built from the real data file at build time; nothing is hand-drawn.
- Captions: what the dots are, that many arrived at night through the whole Earth, and that the only pattern in all those years is the yearly wobble from Earth's slightly oval orbit (F-33), shown as an expected curve computed from the dataset's own distance column rather than read off the noisy points.
- The through-line counter freezes and is shown large.
- Facts: F-24, F-25 (text mention only, no image), F-33, F-32. The famous neutrino image of the Sun is not shipped (D-028).
- Ends with a credits roll generated from `FACTS.md` sources and asset credits.

### 7. "Want more?" panels (only if time remains)

Small optional side panels that open from a corner button on levels 2, 3 and 5. History nuggets: F-26 to F-29, F-13.

## Sound

Web Audio synthesis only, no audio files (D-025). A tiny cue set: charge hum, pop, chime, whoosh, pass-through "thwip", tick, blip, ta-da, plus a ring swell for the hit. Cues are named in `BEATS.md` per beat. A cinematic soundtrack is an add-if-time item, never a cut-from item.

## Architecture

Keep it small. One TypeScript app, one renderer, one scene graph, levels swapped in and out.

- `src/main.ts` — creates the renderer, the level manager, the HUD, the audio, the debug GUI.
- `src/levels/` — one file per level. Each exports an object implementing `Level`: `enter()`, `update(dt)`, `exit()`. Levels own their three.js objects and dispose them on exit.
- `src/rail/` — a reusable "rail" scene: camera moving along a path past instanced obstacles or scenery, with hooks for steering and for spawning things. Levels 3 and 4 are configurations of it.
- `src/character/neutrino.ts` — builds the character mesh from `src/character/config.json`, whose shape is exactly the tuner's JSON output, so tuned values load without transcription. The material and skin-texture code is ported from `docs/mockups/character-tuner.html`. Exposes `setFlavor()` (a material color lerp), `react(name)` (an eye-texture redraw plus a GSAP body squash), `moveTo()`.
- `src/hud/` — DOM overlay (HTML/CSS, not 3D text): caption cards, key prompts, meters, the through-line counter, mini-game buttons, credits.
- `src/audio/` — Web Audio cue functions keyed by the names in `BEATS.md`.
- `src/content/facts.ts` — the code mirror of `docs/FACTS.md`: every caption as data `{ id, text, sources, reaction, cue }`. Keyed by the same F-xx IDs. Credits render from this.
- `src/debug/` — lil-gui and Stats, only mounted when `?debug` is in the URL. A `?level=N` flag jumps to a level, and a small `window.ghost` hook exposes `next()` (advance one beat) and `react(name)` so tests can drive the game deterministically.
- `scripts/check-facts.mjs` — a few lines that collect every `F-xx` referenced under `src/` and fail if any is missing from `docs/FACTS.md`. Runs with the tests.
- `tests/` — Playwright: app boots, each level can be entered by URL flag and stepped with the debug hook, no console errors, a screenshot per level.

State flow: level manager holds the current level index. Levels signal `done` to advance. Captions are a queue the HUD drains on key press. The counter is a single clock started at level 1. No global store beyond that.

## Look and feel

Deep navy and violet space, soft nebula gradients, bright saturated accents, rounded shapes, gentle bloom. Toy-like materials: smooth, slightly glossy. Sparse UI in a rounded sans-serif. Astro Bot is the reference for tone only; no assets or characters from it are used.

## Performance and cheap rendering choices

Target 60 fps on a mid-range laptop. Few draw calls: instanced meshes for plasma, nuclei, and sensor "eyes"; one bloom pass (UnrealBloomPass through EffectComposer with an OutputPass, proven in the tuner) and nothing else; textures at 1k or below. Level 5 rings are drawn onto a canvas texture mapped to the inside of the cylinder, not by lighting individual sensors, the same canvas-texture technique the character's eyes use. The character is one sphere with a canvas skin, no custom shaders.

## Build order and budget (5 hours)

Build the spine, then the ending, then the middle (D-023). If time runs out the middle collapses to captions but the climax and ending exist.

| Step | What | Time |
|---|---|---|
| 1 | Spine: scaffold, renderer, level manager, character with reactions, caption HUD, counter, rail scene, audio cues | 1h 10 |
| 2 | Level 1 | 0h 20 |
| 3 | Level 5 | 1h 30 |
| 4 | Level 6 + credits | 0h 25 |
| 5 | Level 3 | 0h 35 |
| 6 | Level 4 | 0h 25 |
| 7 | Level 2 | 0h 15 |
| 8 | Playwright smoke test, polish | 0h 20 |

Add if time remains, in this order: level 7 panels, cinematic soundtrack, touch input.

The character's material and skin code already exists in the tuner, so step 1's character work is porting plus the reaction redraws, not design.

## Cut order

If behind schedule, drop in this order:

1. Level 7 side panels.
2. Level 4 family photo becomes a single static card (no click).
3. Level 3 steering becomes an auto-scroll with the same captions.
4. Level 5 mini-game drops to three rings. The hero's hit is never cut.
