# Ghost Particle on phones — design

Ghost Particle plays on a phone or tablet in the browser, in either orientation, with the same build that serves desktop. Desktop behaviour is unchanged. The work lives on branch `mobile` and deploys to its own site, so the main deployment is untouched until the branch is merged.

## Goals

- Every interaction the game has (hold, tap to continue, steer, pick a tile, label a ring) works by touch.
- Text, cards, the counter, the level 4 grid, the level 5 buttons and the credits fit a 360 px wide portrait screen and a 640 px tall landscape screen with nothing cropped or overflowing.
- The scene stays framed in portrait: the neutrino, the level 5 tank and the level 6 sky map are visible.
- Smooth on a recent phone; playable on an older one.
- Desktop: no change in behaviour, wording, or layout.

## Non-goals

Tilt controls, a native wrapper, offline support, haptics, a separate mobile entry point.

## Detection

`src/input/device.ts` exports `isTouch(): boolean`, true when `matchMedia('(pointer: coarse)')` matches, and false where `matchMedia` is missing (unit tests). CSS uses the same media query, plus `(max-width: 720px)` and `(orientation: portrait)` for layout.

## Touch input

`Keys` gains public `down(code)` and `up(code)` methods (today's private `handleDown` / `handleUp`). Nothing else in `Keys` changes.

`src/input/touch.ts` exports `class Touch` constructed with a `Keys` instance and a root element (the HUD layer). It offers:

- `hold(code)`: any `pointerdown` on the root whose target is not inside a card, tile or button presses `code` down; the matching `pointerup` / `pointercancel` releases it. Used for Space in level 1 (charge) and level 5 (hero hit).
- `halves(leftCode, rightCode)`: pointers on the left half of the root press `leftCode`, on the right half press `rightCode`; simultaneous pointers are tracked by pointerId so a thumb on each side works. Renders two faint arrow buttons (`.hud-touch-arrow`) as affordance. Used for the level 3 steer.
- `clear()`: releases any held codes, removes listeners and affordance.

Each `hold` or `halves` call clears the previous region first, so a level declares at most one region at a time. The HUD's existing `closers` sweep on level exit calls `clear()`.

Every pointerdown on the root also calls the unlock callback given to `Touch`, which `main.ts` wires to `cues.unlock()`, mirroring the Space unlock.

Cards, tiles and the E/M buttons already handle `click`; touch targets grow via CSS (min 44 px tall).

The HUD exposes `hud.touch` (the `Touch` instance), so levels declare regions where they already set prompts.

## Wording

`src/hud/hints.ts` exports `hint(id)` returning keyboard or touch phrasing by `isTouch()`:

| id | keyboard | touch |
|---|---|---|
| hold | Hold Space | Hold anywhere |
| press | Press Space | Tap anywhere |
| continue | Space to continue | Tap to continue |
| steer | Arrow keys to steer | Hold left or right to steer |
| hit | Press Space to hit the electron | Tap to hit the electron |
| pick | Arrow keys to move, Space to pick. | Tap the tile that is you. |

Call sites in `hud.ts`, `level1.ts`, `level3.ts`, `level4.ts` and `level5.ts` use `hint()` instead of literals. Level 3's card "Try to hit something. Arrow keys to steer." and level 4's note keep their fact tags; only the control phrase inside them swaps. Card word counts stay under the D-015 cap.

## Layout

All in `src/style.css`, no new stylesheet.

- `@media (max-width: 720px)`: cards are `width: 92vw`, `bottom: calc(3vh + env(safe-area-inset-bottom))`, text `font-size: 1rem`; the counter, sub line and flavor tag use `top` offsets that add `env(safe-area-inset-top)` and shrink to 0.8rem; buttons and tiles have `min-height: 2.75rem`; the reveal line wraps; the credits box is `width: 92vw` with a shorter scroll; sky map notes sit above the bottom safe area.
- `@media (orientation: portrait)`: the level 4 grid is `width: 92vw`, `top: 6vh`; the meter is `width: 70vw`; the prompt sits at `bottom: 18vh`.
- `hud.grid()` takes its column count from the caller as today. Level 4 passes 3 columns when `isTouch() && innerWidth < innerHeight`, so a narrow desktop window keeps 6 columns and keyboard wrap-around stays correct.
- `index.html` sets `viewport-fit=cover` so the safe-area insets are populated.

## Camera framing in portrait

`Stage.resize()` applies the widened fov only on touch: `this.camera.fov = isTouch() ? portraitFov(this.camera.aspect) : DESKTOP_FOV`. `portraitFov` sets the vertical fov so the horizontal fov never drops below the desktop value at 3:2: `fov = aspect < 1.5 ? 2·atan(tan(13°)·1.5/aspect) : 26`, in degrees, clamped to 60. The formula lives in `src/render/fov.ts` as `portraitFov(aspect)`, pure and unit-tested, so a narrow desktop window still renders at 26°. Level cameras are not edited. If a level still crops in portrait after this, it is fixed in that level file and the plan notes which.

## Performance

In `Stage`: pixel ratio capped at 1.5 when `isTouch()`, else 2 as today. The bloom pass resolution is set to half the drawing-buffer size on touch devices. No other rendering changes.

## Tests

- `tests/unit/touch.test.ts`: with a fake `Keys` and a fake root emitting pointer events, `hold` presses and releases the code, `halves` maps by x position and tracks two pointers, `clear` releases and detaches.
- `tests/unit/hints.test.ts`: both phrasings for each id; the touch phrasing never mentions Space or arrows.
- `tests/unit/fov.test.ts`: the formula at 16:9, 3:4 and 9:19.5.
- Playwright: projects `mobile` (Pixel 7, portrait) and `mobile-landscape` beside the desktop project. They run the smoke test plus `tests/e2e/mobile.spec.ts`: each level entered by `?level=N` shows no HUD element with a bounding box outside the viewport, the card hint reads "Tap to continue", and a pointer press on the stage in level 1 fills the meter.
- `npm run shots` also writes portrait screenshots to `shots/mobile/`.

## Branch and deployment

Branch `mobile` in a worktree; nothing is committed to `main`. A new exe.dev VM `ghost-particle-mobile` serves `/var/www/ghost-particle` with nginx on port 8000 exactly like the current VM. `npm run deploy:mobile` builds and rsyncs to it. Public URL: https://ghost-particle-mobile.exe.xyz. The existing VM, its nginx config and the `deploy` script are not touched.

## Docs

- `DECISIONS.md`: D-030 "Touch and small screens — accepted": one build, capability-detected touch layer, hold-anywhere and screen-halves scheme, both orientations supported, wording swaps per input, the mobile site URL.
- `SPEC.md`: the non-goal line becomes "desktop keyboard first; touch and phone layouts are supported (D-030)".
