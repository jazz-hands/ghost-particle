# Ghost Particle — Pre-coding TODO

Everything to settle or produce before the first line of app code. Check items off here; record the outcome of any decision in `DECISIONS.md` and any fact in `FACTS.md`.

## 1. Decisions to settle (each has an entry in DECISIONS.md)

- [x] D-001 Which neutrino is the hero: boron-8 neutrino. Accepted.
- [x] D-010 Keyboard only for v1. Accepted.
- [x] D-011 Flavor tints and base color. Accepted, values in DECISIONS.md.
- [x] D-012 / D-020 Level 3 has no collision and no fail state. Accepted.
- [x] D-013 Mini-game reveals after each ring. Accepted.
- [x] D-014 Hosting on exe.dev. Accepted.

## 2. Facts to verify and pin (see status column in FACTS.md)

Most entries are now verified. Remaining "check" items, none of which change on-screen wording:

- [x] F-02 endpoints, F-03, F-04, F-08, F-09, F-13, F-16, F-21, F-24, F-26, F-27, F-28, F-31: verified with URLs.
- [x] F-24: official URL found (5-day file and full SK-IV release on the collaboration's public data page).
- [ ] F-07: read Table 1 of Bahcall, Serenelli & Basu 2005 and record the BS05(OP) pp and ⁸B values (needs a PDF reader; `brew install poppler` gives `pdftotext`).
- [ ] F-05: read the Δm² values off the PDG 2024 neutrino mixing review (same PDF issue).
- [ ] F-22: read the particle-identification section of Ashie et al. 2005 to confirm misidentification wording (same PDF issue).
- [ ] F-29: open the 1988 Nobel summary page.
- [ ] F-32: read the standing projected-area factor off Fanger 1970 or Kubaha et al. 2004 (planning value 0.3). If it cannot be opened, switch the counter to the per-square-centimetre fallback.
- [x] F-25 / A-01: no rights request. Level 6 plots the public dataset instead (D-028).
- [ ] A-02: download `sksolartimevariation5804d.txt` into `public/data/` at scaffold time, keep the original header, and record the download date in FACTS.md F-24.
- [ ] F-11: dropped unless a primary source appears (no change needed).

## 3. Content to write (plain language, each line tagged with an F-ID)

- [x] Caption script for levels 1–6: written in BEATS.md, every card tagged with fact IDs and under 25 words.
- [ ] Review BEATS.md captions for plain-language compliance (D-005) with someone outside physics.
- [x] Reaction set and sound cue set: defined in BEATS.md.
- [x] Level 4 family photo: 17 tile labels written in BEATS.md.
- [x] Level 5 mini-game: five ring answers and reveal lines written in BEATS.md.
- [ ] Level 7 side-panel text (only after everything else).
- [ ] Credits page copy: sources, dataset credit, "made with" list, tint disclaimer, counter reference-person disclosure.

## 4. Art and reference (no external assets shipped)

- [x] Character: bubble with ink eyes, no antenna (D-029).
- [ ] Final character values: tune in `docs/mockups/character-tuner.html`, paste the JSON into D-029.
- [ ] Eye shapes per reaction: define lid, tilt, spacing and highlight values for each of the eleven reactions in BEATS.md, using the tuner's eye controls. The tuner has upper and lower lid controls, so "cheer" (upward arcs) is expressible.
- [ ] Palette: background gradient stops, UI accent, plasma color in L3, sensor "eye" gold in L5 (flavor tints and base are settled in D-011). Note: `scene.background` passes through ACES tone mapping and exposure, so the current `#070b1a` renders near black on screen; pick the on-screen value inside that pipeline, or paint the background in CSS behind a transparent renderer.
- [ ] Reference board from the Astro Bot screenshots (private, not committed).
- [ ] Rough layout for the HUD: caption card position, key prompt, meters, mini-game buttons.

## 5. Tech verification (Context7 was unreachable this session; confirm at start of build)

- [x] three.js 0.186.0 (MIT). Its `package.json` exports map `three/addons/*` to `examples/jsm/*`, and the tarball contains `examples/jsm/libs/lil-gui.module.min.js` and `examples/jsm/libs/stats.module.js`, so the `three/addons/libs/...` imports resolve under Vite.
- [x] GSAP 3.15.0, licence field reads "Standard 'no charge' license" (https://gsap.com/standard-license), zero runtime dependencies.
- [x] Vite 8.3.0. @playwright/test 1.63.0 pulls in `playwright` and `playwright-core` plus a browser download on install.
- [x] Playwright with Chromium headless renders WebGL with `--use-angle=swiftshader --enable-unsafe-swiftshader` (asserted by `tests/e2e/smoke.spec.ts`).
- [ ] Node v26.8.2 and npm are installed at `/opt/homebrew/bin` but that directory is not on PATH in non-interactive shells, which is why `npx` was missing and the Context7 and Playwright MCP servers failed to connect. Fix: add `/opt/homebrew/bin` to PATH in `~/.zshenv` (not only `~/.zshrc`).
- [ ] Install `poppler` (`brew install poppler`) so PDFs can be read for the remaining fact checks.
- [x] Bloom: UnrealBloomPass through EffectComposer with an OutputPass, proven in `character-tuner.html`; gentle defaults recorded there.
- [x] Web Audio: the first Space hold in level 1 is the unlocking gesture; beat 1.1 is silent by design.

## 6. Scaffold (first coding step, after the above)

- [x] Vite vanilla TypeScript project, written by hand to the template's shape. `vite.config.ts` has `server: { host: true, allowedHosts: ['.exe.xyz'] }` (D-014).
- [x] three, @types/three and @playwright/test added at exact versions; what each pulls in is in the commit that added it. gsap comes with the character port.
- [x] Folder layout per SPEC.md architecture for the modules that exist; the character port, `src/hud`, `src/audio` and `src/rail` arrive with the spine.
- [x] `src/content/facts.ts` mirrors FACTS.md; `scripts/check-facts.mjs` runs with `npm test`.
- [x] `src/character/config.json` holds the final tuner JSON (D-029).
- [ ] Port the tuner's material and skin-texture code into `src/character/`.
- [ ] Download A-02 (`sksolartimevariation5804d.txt`) into `public/data/`, confirm the flux column definition against its header and the PRL paper, then write the level 6 axis label (F-24).
- [x] Playwright smoke test: boots, no console errors, WebGL, `?level=N`, `window.ghost.next()`, `?debug`, screenshot per level.
- [x] First commit.
