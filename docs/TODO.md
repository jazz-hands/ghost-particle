# Ghost Particle — Pre-coding TODO

Everything to settle or produce before the first line of app code. Check items off here; record the outcome of any decision in `DECISIONS.md` and any fact in `FACTS.md`.

## 1. Decisions to settle (each has an entry in DECISIONS.md)

- [x] D-001 Which neutrino is the hero: boron-8 neutrino. Accepted.
- [ ] D-010 Input scheme: keyboard only for v1, or keyboard plus touch.
- [ ] D-011 Flavor colors (three tints) and the character's base color.
- [ ] D-012 Whether level 3 dodging has any consequence at all, or is pure lesson (recommend: pure lesson).
- [ ] D-013 Mini-game feedback: per-ring reveal vs end-of-round summary.
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

## 3. Content to write (plain language, each line tagged with an F-ID)

- [ ] Caption script for levels 2–6: 5–7 cards per level, max 25 words per card, every card lists its fact IDs.
- [ ] A reaction name per card (nod, wiggle, blush, shrug, spin, peek) so the character's expression set is known before modelling.
- [ ] Level 4 family photo: one-line plain description per Standard Model row.
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

## 6. Scaffold (first coding step, after the above)

- [ ] `npm create vite@latest` with the vanilla TypeScript template.
- [ ] Add three, gsap, @playwright/test. Record what each pulls in.
- [ ] Folder layout per SPEC.md architecture.
- [ ] `src/content/facts.ts` generated or hand-mirrored from FACTS.md with the same IDs.
- [ ] One Playwright smoke test: app boots, no console errors, screenshot.
- [ ] First commit.
