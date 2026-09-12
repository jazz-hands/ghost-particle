# Ghost Particle — Spec

A short, on-rails browser game. You ride along with one neutrino from its birth in the Sun's core to a detector under a mountain in Japan, and you learn what a neutrino is by what happens to it on the way.

Playable in a browser, no install, one sitting of roughly 10–15 minutes. The neutrino is the only character on screen.

## Audience and goals

- Audience: any adult with no physics background. Curious kids welcome.
- Goal 1: the player finishes knowing five things: what a neutrino is, where the Sun's neutrinos come from, why almost nothing stops them, that they come in three "flavors" and can switch, and how a real detector catches them.
- Goal 2: it feels like a playful space toy (Astro Bot energy), not a slideshow.
- Non-goals: no human characters, no free roaming, no scoring or leaderboards, no mobile-first layout (desktop keyboard first; touch is a stretch goal).

## Rules that shape everything

See `DECISIONS.md` for the full list. The ones that matter most:

- Every fact, number, formula, and image shown to the player lives in `FACTS.md` with a source, and nowhere else. The spec, captions, and code reference fact IDs (F-xx). Credits render from that file. Nothing invented.
- Plain language. Any technical word is explained the first time it appears.
- One character. The neutrino. No people, no hands, no faces other than the neutrino's.
- Build budget is 4–5 hours. Anything that doesn't fit is cut in the order listed under "Cut order".

## The character

The neutrino is a small, rounded, ghost-like, toy-like character. Roughly 50% opacity with a soft glow, two expressive eyes, and simple squash-and-stretch animation. It reacts to captions (nods, wiggles, blushes, shrugs) using a small set of named expressions. It has no arms or legs; motion and eyes carry the personality.

Flavor is shown as a tint and a small icon: electron-flavor, muon-flavor, tau-flavor. Exact colors are a design decision, not a physics one, and the credits say so.

## Level progression

Each level is one scene with one mechanic and a handful of captions. The player advances on rails; interaction is limited to the level's mechanic plus "continue".

### 1. Birth (wordless)

- Scene: black, quiet, a faint warm glow. Two soft glowing blobs drift toward the center.
- Mechanic: hold a key. A meter fills while held. Release at full: a flash, then a wobbling unstable nucleus that pops, and the neutrino blinks into existence.
- Learn (by doing, no text except the key prompt): the Sun makes neutrinos by squeezing nuclei together.
- The two blobs are a proton and a beryllium-7 nucleus; the squeeze makes boron-8, which pops and releases the hero (D-001, F-02).

### 2. Meet the neutrino (captions on)

- Scene: same dark core, camera pulls back to reveal the neutrino floating in a warm haze.
- Mechanic: press to advance through 5–7 caption cards. Each card triggers a reaction from the neutrino.
- Facts: F-01, F-02, F-03, F-04, F-06, F-07, F-10.
- Optional side panel ("Want more?"): F-26, F-27.

### 3. Escaping the Sun

- Scene: rushing outward through layers of dense, bright plasma toward the surface.
- Mechanic: dodge. Walls of plasma and heavy nuclei come at the player. The player can steer left/right. Whether or not they dodge, the neutrino passes straight through. After the first pass-through a caption says why. Later obstacles become optional to dodge so the lesson lands.
- Flavor change: as it climbs, the tint shifts between electron, muon, and tau flavor. Caption explains the three flavors and that a neutrino born as one kind can be found later as another.
- Facts: F-08, F-09, F-10, F-12, F-13, F-05, F-14.

### 4. The trip to Earth

- Scene: open space, the Sun shrinking behind, Earth growing ahead. A travel meter shows distance covered.
- Mechanic: none, or a light "boost" hold to speed the trip. The meter ticks up in kilometers and in light-seconds.
- Standard Model "family photo": a stylised lineup card of the particle families (quarks, leptons, force carriers, Higgs), with the neutrino waving from its spot among the leptons. Cute, not exhaustive. Each row has a one-line plain description.
- Facts: F-15, F-16. Formula F-30 drives the meter.

### 5. Super-Kamiokande

- Scene: arrive at Japan, dive 1,000 meters underground into a giant cylinder of water lined with thousands of glowing gold "eyes" (light sensors).
- Mechanic: the identification mini-game. The player sees 5–8 flashes of light on the tank wall, each a ring. Sharp-edged rings were made by muons; fuzzy rings by electrons. The player labels each one. Score is feedback only, no fail state. A final card explains that solar neutrinos show up as electron rings pointing away from the Sun.
- Facts: F-17, F-18, F-19, F-20, F-21, F-22, F-23. Formula F-31 sizes the rings.
- Honesty note on screen: rings in the game are simulated from the published detector geometry and ring physics (F-24). They are not real event records.

### 6. The Sun at night

- Scene: the tank fades to the famous Super-Kamiokande "picture" of the Sun made from neutrinos. The neutrino floats beside it.
- Facts: F-25 (image A-01). Usage rights are a TODO item.
- Ends with a credits roll generated from `FACTS.md` sources and asset credits.

### 7. "Want more?" panels (only if time remains)

Small optional side panels that open from a corner button on levels 1, 3 and 5. History nuggets: F-26 to F-29, F-13.

## Architecture

Keep it small. One TypeScript app, one renderer, one scene graph, levels swapped in and out.

- `src/main.ts` — creates the renderer, the level manager, the HUD, the debug GUI.
- `src/levels/` — one file per level. Each exports an object implementing `Level`: `enter()`, `update(dt)`, `exit()`. Levels own their three.js objects and dispose them on exit.
- `src/character/neutrino.ts` — builds the character mesh, exposes `setFlavor()`, `react(name)`, `moveTo()`. GSAP drives the animations.
- `src/hud/` — DOM overlay (HTML/CSS, not 3D text): caption cards, key prompts, meters, mini-game buttons, credits.
- `src/content/facts.ts` — the code mirror of `docs/FACTS.md`: every caption as data `{ id, text, sources, reaction }`. Keyed by the same F-xx IDs. Credits render from this.
- `src/debug/` — lil-gui and Stats, only mounted when `?debug` is in the URL.
- `tests/` — Playwright: app boots, each level can be entered and exited by key press, no console errors, a screenshot per level.

State flow: level manager holds the current level index. Levels signal `done` to advance. Captions are a queue the HUD drains on key press. No global store beyond that.

## Look and feel

Deep navy and violet space, soft nebula gradients, bright saturated accents, rounded shapes, gentle bloom. Toy-like materials: smooth, slightly glossy. Sparse UI in a rounded sans-serif. Astro Bot is the reference for tone only; no assets or characters from it are used.

## Performance

Target 60 fps on a mid-range laptop. Few draw calls: instanced particles for plasma and sensor "eyes", no post-processing beyond one bloom pass, textures at 1k or below.

## Build budget (5 hours)

| Block | Time |
|---|---|
| Scaffold, renderer, level manager, character, HUD skeleton | 1h 00 |
| Level 1 + 2 | 0h 45 |
| Level 3 | 0h 45 |
| Level 4 | 0h 30 |
| Level 5 | 1h 00 |
| Level 6 + credits | 0h 30 |
| Playwright smoke tests, polish | 0h 30 |

## Cut order

If behind schedule, drop in this order:

1. Level 7 side panels.
2. Level 4 family photo becomes a single static card.
3. Level 3 dodging becomes an auto-scroll with the same captions.
4. Level 5 mini-game drops to three rings.
