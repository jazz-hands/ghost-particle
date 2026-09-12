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
| D-010 | Input scheme | accepted | Keyboard only for v1. |
| D-011 | Flavor tints | accepted | Electron sky-blue, muon violet, tau coral; base white with blue glow. Disclosed as a design choice. |
| D-012 | Dodging has no consequence | accepted | Superseded by D-020: nothing can be hit, no fail state. |
| D-013 | Mini-game feedback timing | accepted | Reveal answer and one-line reason after each ring. |
| D-014 | Hosting | accepted | Static build hosted on exe.dev. |
| D-015 | Text policy | accepted | Level 1 is wordless; captions are cards of at most 25 words. |
| D-016 | HUD is DOM, not 3D text | accepted | Captions, meters, and buttons are HTML overlays. |
| D-017 | Debug tools gated by URL flag | accepted | lil-gui and Stats mount only with `?debug`. |
| D-018 | Level module contract | accepted | Each level exports `enter`, `update`, `exit`, and disposes its own objects. |
| D-019 | Level 2 is three cards | accepted | No level is pure reading; level 2 is capped at three cards. |
| D-020 | Level 3 is "try to hit something" | accepted | Player steers into obstacles and passes through every one; no collision, no fail state. |
| D-021 | Level 4 find-yourself click | accepted | Family photo is a grid; the player clicks their own tile. |
| D-022 | Level 5 opens with the hero's own hit | accepted | The climax: the neutrino hits an electron and makes the first ring. Never cut. |
| D-023 | Build order: spine, ending, middle | accepted | Spine, L1, L5, L6, L3, L4, L2, tests. |
| D-024 | Through-line counter | accepted | Neutrinos through the player since pressing start, per F-32. |
| D-025 | Sound is Web Audio synthesis | accepted | Named synth cues, no audio files. Soundtrack only if time remains. |
| D-026 | BEATS.md is the script | accepted | If a moment isn't in the beat sheet, it isn't built. |
| D-027 | Cheap rendering for level 5 | accepted | Sensors are one instanced mesh; rings are drawn on a canvas texture on the cylinder wall. |
| D-028 | Level 6 plots the public dataset | accepted | No rights request for the Sun image; the ending is a chart of Super-K's 22-year public record. |

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

### D-010 Input scheme — accepted

Keyboard only for v1: Space to hold and to advance, arrow keys to steer in level 3, click or number keys for the level 4 tile and the level 5 buttons. Touch is an add-if-time item.

### D-011 Flavor tints — accepted

Base body white with a cool blue glow. Electron flavor sky-blue `#4FC3F7`, muon flavor violet `#B388FF`, tau flavor coral `#FF8A65`. These are design choices with no physical meaning; the credits say so. The three are far apart in hue and readable against the navy background, and the flavor icon under the counter repeats the tint so colour alone is not the only cue.

### D-012 Dodging has no consequence — accepted

Superseded by D-020. Obstacles never stop the neutrino and there is no fail state.

### D-013 Mini-game feedback timing — accepted

Reveal the correct answer after each ring, with a one-line reason, rather than a summary at the end. Keeps the teaching close to the choice. The fifth ring is deliberately ambiguous and revealed as such (F-22).

### D-014 Hosting — accepted

Static build output hosted on an exe.dev VM. No server component.

What this means in practice:
- A VM gets `https://<vm>.exe.xyz/` with TLS. The URL is private by default: unauthenticated requests get a 307 to a login page whether or not anything is running. Make it public with `ssh exe.dev share set-public <vm>`, or hand out a revocable link with `share add-link`.
- The proxy forwards one port, 8000 by default (`ssh exe.dev share port <vm> <port>`). Serve `dist/` on that port with nginx, which the image ships, or any static server.
- The current image does not ship Node; if the build runs on the VM, install Node from NodeSource and say so, since that is network egress the project did not otherwise declare.
- If the Vite dev server is ever exposed through the proxy, it needs `server: { host: true, allowedHosts: ['.exe.xyz'] }` or it answers 403.
- Git on the VM reaches GitHub through `github.int.exe.xyz`, not github.com, and needs an exe.dev GitHub integration if the repo is ever pushed there.

Source: the `using-exe-dev` and `exe-dev-gotchas` skills in `~/.claude/skills/`. Verify against live output; the platform moves.

### D-015 Text policy — accepted

Level 1 shows only the key prompt. From level 2 on, captions are cards of at most 25 words, at most 7 per level, each tagged with its F-IDs. Side panels ("Want more?") are optional and never block progress.

### D-016 HUD is DOM, not 3D text — accepted

Captions, meters, prompts, mini-game buttons, and credits are HTML/CSS overlays. Cheaper to build, accessible, and easy to test with Playwright.

### D-017 Debug tools gated by URL flag — accepted

lil-gui and Stats mount only when the URL contains `?debug`. Production builds ship without them visible.

### D-018 Level module contract — accepted

Each level is one file exporting an object with `enter()`, `update(dt)`, `exit()`. Levels create their own three.js objects and dispose them in `exit()`. The level manager owns ordering and transitions. Levels never reach into each other.

### D-019 Level 2 is three cards — accepted

Level 2 is capped at exactly three caption cards (F-03; F-04 with the seesaw gag; F-06 and F-02). The remaining introductory facts are delivered inside levels 3 and 4 where the player is doing something. Rationale: a run of passive cards is where players leave.

### D-020 Level 3 is "try to hit something" — accepted

The player is told to try to hit things and can steer into every obstacle. The neutrino passes through all of them; a tally counts the pass-throughs. There is no collision and no fail state. The failure to collide is both the joke and the lesson (F-10). Supersedes D-012.

### D-021 Level 4 find-yourself click — accepted

The Standard Model family photo is a grid of 17 tiles with plain one-line labels (F-16). The player clicks the tile that is them. Any of the three neutrino tiles counts as correct. Wrong tiles wiggle and show their label; no penalty.

### D-022 Level 5 opens with the hero's own hit — accepted

The first thing that happens in the detector is the hero hitting an electron and making a ring (beats 5.3–5.5). This is the climax of the whole game's arc (touch nothing, then finally touch one thing) and is never cut. The mini-game follows it.

### D-023 Build order: spine, ending, middle — accepted

Build in this order: spine (scaffold, character, HUD, counter, rail scene, audio), level 1, level 5, level 6 with credits, level 3, level 4, level 2, tests. Rationale: if time runs out, the middle collapses to captions but the climax and ending exist. Time table in `SPEC.md`.

### D-024 Through-line counter — accepted

One counter runs from the moment the player presses start in level 1, appears in the HUD from level 2, and is frozen and shown large in level 6: solar neutrinos that have passed through the player's body since starting. Computed per F-32 for a reference adult of 150 lb and 5 ft 7 in, standing and facing the Sun; the credits disclose this. The projected-area factor must be read off its source before the counter ships; the fallback is a per-square-centimetre count.

### D-025 Sound is Web Audio synthesis — accepted

All sound is generated with the Web Audio API from a small set of named cues listed in `BEATS.md`. No audio files are shipped or committed. A cinematic soundtrack is an add-if-time item at the bottom of the build order, never a reason to cut a level.

### D-026 BEATS.md is the script — accepted

`docs/BEATS.md` is the moment-by-moment script: what the player sees, does, the neutrino's reaction, caption text, fact IDs, and sound cue. Captions in `src/content/facts.ts` are copied from it verbatim. If a moment isn't in the beat sheet, it isn't built; if it needs to change, change the beat sheet first.

### D-027 Cheap rendering for level 5 — accepted

The 11,129 inner sensors (F-18) are a single `InstancedMesh` of a low-poly disc or sphere. The 1,885 outer sensors are not rendered; the player is inside the tank. Rings, the hero's cone hit, and the "sensors lighting up" effect are drawn on a 2D canvas texture mapped to the inside of the cylinder, not by lighting individual instances. Ring radius comes from F-31. The character stays two spheres plus eye sprites with no custom shaders. Rationale: keeps level 5 inside its 1h 30 budget and well under the draw-call ceiling.

### D-028 Level 6 plots the public dataset — accepted

The ending uses Super-Kamiokande's public 5-day solar neutrino record, 1996 to 2018 (F-24, A-02), drawn as a chart from the real data file at build time. The famous neutrino image of the Sun (A-01) is not shipped and no usage request is made; the game mentions it only in words. Rationale: no time for a rights request, and the dataset is public, citable, and tells the same story (neutrinos arrive day and night, through the Earth). The chart follows the `dataviz` skill when built.
