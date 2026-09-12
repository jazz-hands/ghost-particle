# Ghost Particle — Decisions

Rules and decisions for anyone working on this project, human or agent. Read the index first. Open items need a decision before the affected level is built.

How to use:
- Reference decisions by ID (D-xxx) in commits, code comments, and captions.
- To add one: append an entry, add an index row, status `open` or `accepted`.
- To change one: edit the entry in place and note the new outcome. Do not keep history here; git has it.
- Facts and figures never live here. They live in `FACTS.md`.

## Index

| ID | Title | Status | One line |
|---|---|---|---|
| D-001 | Which neutrino is the hero | accepted | A boron-8 neutrino, so Super-K can honestly detect it. |
| D-002 | Factual accuracy | accepted | Nothing on screen without an entry in FACTS.md. |
| D-003 | Single source for facts | accepted | FACTS.md is the only place numbers live. |
| D-004 | One character, no humans | accepted | The neutrino is the only character. |
| D-005 | Plain language | accepted | Explain every technical word on first use. |
| D-006 | Style reference, not assets | accepted | Astro Bot is tone reference only; nothing from it ships. |
| D-007 | Tech stack | accepted | TypeScript, Vite, three.js WebGLRenderer, lil-gui + Stats, GSAP, Playwright. |
| D-008 | Detector events are simulated | accepted | Rings are generated from published geometry, labelled as simulation. |
| D-009 | Build budget and cut order | accepted | 5 hours; cut L7, then L4 photo, then L3 dodging, then L5 ring count. |
| D-010 | Input scheme | open | Recommend keyboard only for v1. |
| D-011 | Flavor tints | open | Three tints plus base color; disclose as a design choice. |
| D-012 | Dodging has no consequence | open | Recommend pure lesson, no fail state. |
| D-013 | Mini-game feedback timing | open | Recommend reveal after each ring. |
| D-014 | Hosting | open | Static site; pick host. |
| D-015 | Text policy | accepted | Level 1 is wordless; captions are cards of at most 25 words. |
| D-016 | HUD is DOM, not 3D text | accepted | Captions, meters, and buttons are HTML overlays. |
| D-017 | Debug tools gated by URL flag | accepted | lil-gui and Stats mount only with `?debug`. |
| D-018 | Level module contract | accepted | Each level exports `enter`, `update`, `exit`, and disposes its own objects. |

## Entries

### D-001 Which neutrino is the hero — accepted

Problem: the birth scene squeezes two protons (the pp reaction, F-01). Neutrinos from that step have at most 0.42 MeV of energy, and Super-Kamiokande cannot detect them (F-02, F-23). If the hero is a pp neutrino, the level 5 detection is not honest.

Decision: option 1.

Options considered:
1. **Hero is a boron-8 neutrino (chosen).** The birth mechanic stays identical (hold to squeeze, release to pop) but the blobs are a proton and a beryllium-7 nucleus; the result is boron-8, which wobbles and pops out the neutrino. Level 2 captions add one line: "Most of the Sun's neutrinos come from the simplest squeeze, two protons. You come from a rarer branch, and you carry more energy, which is what lets a detector catch you." Level 5 is fully honest, and level 3's flavor-change fact (F-14) is the one Super-K actually measures.
2. Hero is a pp neutrino. Birth is the iconic two-proton squeeze. At level 5 the caption admits Super-K can't see the hero and the mini-game is about its "cousins". Weaker ending.
3. Hero is a pp neutrino and the detector is Borexino (which did detect pp neutrinos, F-01). Loses Super-K, which the brief wants.

Consequences: affects captions in L1, L2, L3, L5 and the F-IDs those levels use.

### D-002 Factual accuracy — accepted

No fact, number, formula, or figure appears on screen unless it has an entry in `FACTS.md` with a source. Entries marked `check` must be verified before they ship. If a claim can't be sourced, it is cut, not softened.

### D-003 Single source for facts — accepted

`docs/FACTS.md` is the only place a number lives. `SPEC.md`, captions, and code reference F-IDs. `src/content/facts.ts` mirrors it with the same IDs; if they disagree, FACTS.md wins and the code is fixed.

### D-004 One character, no humans — accepted

The neutrino is the only character. No human figures, hands, or faces. Physicists are mentioned by name in text only. Keeps the build inside budget and the style consistent.

### D-005 Plain language — accepted

Audience knows no physics. Every technical word (nucleus, flavor, electronvolt, Cherenkov) is explained in the same card it first appears, in words an average adult knows. Prefer "light sensor" to "photomultiplier tube", then name the real term once.

### D-006 Style reference, not assets — accepted

Astro Bot screenshots guide tone, palette, and playfulness. No Sony or Team Asobi assets, characters, sounds, or logos are used or committed to the repo.

### D-007 Tech stack — accepted

TypeScript, Vite, three.js with WebGLRenderer, lil-gui and Stats from three.js addons, GSAP for tweens and timelines, Playwright for end-to-end smoke tests. No framework (no React). No new dependency without listing what it pulls in.

### D-008 Detector events are simulated — accepted

Super-K raw per-event data is not public (F-24). Level 5 rings are generated from published detector geometry (F-17, F-18) and Cherenkov physics (F-21, F-31), with fuzziness chosen to illustrate F-22. A caption states this. The public 5-day flux dataset may be plotted in level 6 or credits if the real image (A-01) can't be licensed.

### D-009 Build budget and cut order — accepted

Five hours of build time, allocated per the table in `SPEC.md`. If behind, cut in this order: level 7 panels, level 4 family photo (to one static card), level 3 dodging (to auto-scroll), level 5 ring count (to three).

### D-010 Input scheme — open

Recommend keyboard only for v1: Space to hold/advance, arrow keys to steer in L3, number keys or click for mini-game answers. Touch later if time remains.

### D-011 Flavor tints — open

Three tints for electron, muon, tau flavor plus the character's base color. These are design choices with no physical meaning; the credits say so.

### D-012 Dodging has no consequence — open

Recommend: in level 3 the player can steer, but obstacles never stop the neutrino and there is no fail state. The lesson is that nothing stops it. Steering exists only to make the pass-through feel like the player's discovery.

### D-013 Mini-game feedback timing — open

Recommend: reveal the correct answer after each ring, with a one-line reason, rather than a summary at the end. Keeps the teaching close to the choice.

### D-014 Hosting — open

Static build output. Candidates: Vercel, GitHub Pages. No server component is needed.

### D-015 Text policy — accepted

Level 1 shows only the key prompt. From level 2 on, captions are cards of at most 25 words, at most 7 per level, each tagged with its F-IDs. Side panels ("Want more?") are optional and never block progress.

### D-016 HUD is DOM, not 3D text — accepted

Captions, meters, prompts, mini-game buttons, and credits are HTML/CSS overlays. Cheaper to build, accessible, and easy to test with Playwright.

### D-017 Debug tools gated by URL flag — accepted

lil-gui and Stats mount only when the URL contains `?debug`. Production builds ship without them visible.

### D-018 Level module contract — accepted

Each level is one file exporting an object with `enter()`, `update(dt)`, `exit()`. Levels create their own three.js objects and dispose them in `exit()`. The level manager owns ordering and transitions. Levels never reach into each other.
