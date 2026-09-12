# Ghost Particle — Pre-coding TODO

Everything to settle or produce before the first line of app code. Check items off here; record the outcome of any decision in `DECISIONS.md` and any fact in `FACTS.md`.

## 1. Decisions to settle (each has an entry in DECISIONS.md)

- [x] D-001 Which neutrino is the hero: boron-8 neutrino. Accepted.
- [x] D-010 Keyboard only for v1. Accepted.
- [ ] D-011 Flavor colors (three tints) and the character's base color.
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
- [ ] F-25 / A-01: apply to Kamioka Observatory for educational use of the Sun image and contact the LSU credit holders. Fallback is ready: plot the public 5-day dataset (A-02).
- [ ] F-11: dropped unless a primary source appears (no change needed).

## 3. Content to write (plain language, each line tagged with an F-ID)

- [x] Caption script for levels 1–6: written in BEATS.md, every card tagged with fact IDs and under 25 words.
- [ ] Review BEATS.md captions for plain-language compliance (D-005) with someone outside physics.
- [x] Reaction set and sound cue set: defined in BEATS.md.
- [x] Level 4 family photo: 17 tile labels written in BEATS.md.
- [x] Level 5 mini-game: five ring answers and reveal lines written in BEATS.md.
- [ ] Level 5 final card: the honesty note on simulated rings.
- [ ] Level 7 side-panel text (only after everything else).
- [ ] Credits page copy: sources, image credits, "made with" list, tint disclaimer.

## 4. Art and reference (no external assets shipped)

- [ ] Character sketch: silhouette, eye shapes for each reaction, opacity and glow target.
- [ ] Palette: background gradient stops, three flavor tints, UI accent, plasma color in L3, sensor "eye" gold in L5.
- [ ] Reference board from the Astro Bot screenshots (private, not committed).
- [ ] Rough layout for the HUD: caption card position, key prompt, meters, mini-game buttons.

## 5. Tech verification (Context7 was unreachable this session; confirm at start of build)

- [ ] three.js version to pin, and that `three/addons/libs/lil-gui.module.min.js` and `three/addons/libs/stats.module.js` resolve under Vite with the `three` package.
- [ ] GSAP is free for commercial use since 3.13 (April 2025); confirm current license text and pin version.
- [ ] Playwright with Chromium headless renders WebGL in CI (may need `--use-gl=swiftshader` or similar flag).
- [ ] Node v26.8.2 and npm are installed at `/opt/homebrew/bin` but that directory is not on PATH in non-interactive shells, which is why `npx` was missing and the Context7 and Playwright MCP servers failed to connect. Fix: add `/opt/homebrew/bin` to PATH in `~/.zshenv` (not only `~/.zshrc`).
- [ ] Install `poppler` (`brew install poppler`) so PDFs can be read for the remaining fact checks.
- [ ] Bloom approach: three.js UnrealBloomPass via EffectComposer, or skip post-processing and fake glow with sprites.
- [ ] Web Audio: confirm the autoplay policy needs a user gesture first (the level 1 Space hold can be that gesture).

## 6. Scaffold (first coding step, after the above)

- [ ] `npm create vite@latest` with the vanilla TypeScript template.
- [ ] Add three, gsap, @playwright/test. Record what each pulls in.
- [ ] Folder layout per SPEC.md architecture.
- [ ] `src/content/facts.ts` generated or hand-mirrored from FACTS.md with the same IDs.
- [ ] One Playwright smoke test: app boots, no console errors, screenshot.
- [ ] First commit.
