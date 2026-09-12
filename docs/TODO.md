# Ghost Particle — Pre-coding TODO

Everything to settle or produce before the first line of app code. Check items off here; record the outcome of any decision in `DECISIONS.md` and any fact in `FACTS.md`.

## 1. Decisions to settle (each has an entry in DECISIONS.md)

- [x] D-001 Which neutrino is the hero: boron-8 neutrino. Accepted.
- [ ] D-010 Input scheme: keyboard only for v1, or keyboard plus touch.
- [ ] D-011 Flavor colors (three tints) and the character's base color.
- [x] D-012 / D-020 Level 3 has no collision and no fail state. Accepted.
- [x] D-013 Mini-game reveals after each ring. Accepted.
- [ ] D-014 Hosting target (static site; Vercel, GitHub Pages, or other).

## 2. Facts to verify and pin (see status column in FACTS.md)

- [ ] Every entry marked **check** in FACTS.md gets a confirmed citation with page/figure/URL.
- [ ] F-02: confirm pp endpoint (0.42 MeV) and ⁸B spectrum upper end (~15 MeV) from an SK or Bahcall source.
- [ ] F-07: pick one standard solar model and record its pp and ⁸B fluxes exactly.
- [ ] F-08: confirm the photon diffusion time range and the citation.
- [ ] F-22: find an SK collaboration paper describing e-like / μ-like classification.
- [ ] F-24: find the official URL of the public 5-day solar flux dataset on the SK site.
- [ ] F-25 / A-01: confirm usage rights for the Super-K "Sun in neutrinos" image (contact Super-K public relations or LSU). If unavailable, plan a fallback: render the public 5-day dataset as a plot instead.
- [ ] F-11: decide to drop the "light-year of lead" line unless a primary source appears.
- [ ] F-32: source an adult body cross-sectional area (as seen from the Sun) for the through-line counter. The counter cannot ship until this has a citation.

## 3. Content to write (plain language, each line tagged with an F-ID)

- [x] Caption script for levels 1–6: written in BEATS.md, every card tagged with fact IDs and under 25 words.
- [ ] Review BEATS.md captions for plain-language compliance (D-005) with someone outside physics.
- [x] Reaction set and sound cue set: defined in BEATS.md.
- [ ] Level 4 family photo: one-line plain label for each of the 17 tiles (F-16), written in BEATS.md or facts.ts.
- [ ] Level 5 mini-game: the one-line reveal reason for each of the five rings (beat 5.9).
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
- [ ] Node and npm/pnpm are on PATH in the build environment (npx was missing in this session, which is why Context7 and Playwright MCP servers failed to connect).
- [ ] Bloom approach: three.js UnrealBloomPass via EffectComposer, or skip post-processing and fake glow with sprites.
- [ ] Web Audio: confirm the autoplay policy needs a user gesture first (the level 1 Space hold can be that gesture).

## 6. Scaffold (first coding step, after the above)

- [ ] `npm create vite@latest` with the vanilla TypeScript template.
- [ ] Add three, gsap, @playwright/test. Record what each pulls in.
- [ ] Folder layout per SPEC.md architecture.
- [ ] `src/content/facts.ts` generated or hand-mirrored from FACTS.md with the same IDs.
- [ ] One Playwright smoke test: app boots, no console errors, screenshot.
- [ ] First commit.
