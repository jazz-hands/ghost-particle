import type { EyeSettings } from './config.ts';

// Pure description of the reaction set (BEATS.md). No three.js: the tuner page carries a
// plain-JS copy of this file, and the two are kept line-for-line comparable.

export interface Pose {
  scaleX: number; scaleY: number; offsetX: number; offsetY: number; rotZ: number; rotY: number;
  squint: number; lowerLid: number; eyeWidth: number; eyeTall: number;
  eyeShiftX: number; eyeShiftY: number; eyeTilt: number; leftEye: number; rightEye: number;
}

export type Ease = 'linear' | 'in' | 'out' | 'inOut' | 'back';

export type Keyframe = Partial<Pose> & { t: number; ease?: Ease };

export const IDLE: Pose = {
  scaleX: 1, scaleY: 1, offsetX: 0, offsetY: 0, rotZ: 0, rotY: 0,
  squint: 0, lowerLid: 0, eyeWidth: 1, eyeTall: 1,
  eyeShiftX: 0, eyeShiftY: 0, eyeTilt: 0, leftEye: 1, rightEye: 1,
};

const CHANNELS = Object.keys(IDLE) as (keyof Pose)[];

const EASES: Record<Ease, (x: number) => number> = {
  linear: (x) => x,
  in: (x) => x * x,
  out: (x) => 1 - (1 - x) * (1 - x),
  inOut: (x) => 0.5 - Math.cos(Math.PI * x) / 2,
  back: (x) => 1 + 2.7 * (x - 1) ** 3 + 1.7 * (x - 1) ** 2,
};

export const REACTIONS: Record<string, Keyframe[]> = {
  // Squash flat and squeeze the eyes shut, expecting an impact that never comes.
  brace: [
    { t: 0 },
    { t: 0.12, scaleX: 1.2, scaleY: 0.7, offsetY: -0.11, squint: 0.86, eyeWidth: 1.12, ease: 'out' },
    { t: 0.44, scaleX: 1.22, scaleY: 0.68, offsetY: -0.12, squint: 0.9, eyeWidth: 1.12, ease: 'inOut' },
    { t: 0.78, scaleX: 1, scaleY: 1, offsetY: 0, squint: 0.2, ease: 'out' },
    { t: 0.95, ease: 'back' },
  ],
  // Pop back to round (the body's own squash undone) with the eyes wide.
  surprised: [
    { t: 0 },
    { t: 0.09, scaleX: 1.06, scaleY: 0.9, offsetY: -0.04, ease: 'out' },
    { t: 0.26, scaleX: 0.94, scaleY: 1.1, offsetY: 0.07, eyeWidth: 1.35, eyeTall: 1.35, ease: 'back' },
    { t: 0.6, scaleX: 0.95, scaleY: 1.07, offsetY: 0.05, eyeWidth: 1.3, eyeTall: 1.3, ease: 'inOut' },
    { t: 0.92, ease: 'out' },
  ],
  // Crouch, launch with a stretch, land with a squash; the lower lids ride up into arcs.
  cheer: [
    { t: 0 },
    { t: 0.11, scaleX: 1.14, scaleY: 0.84, offsetY: -0.08, ease: 'out' },
    { t: 0.36, scaleX: 0.88, scaleY: 1.18, offsetY: 0.3, lowerLid: 0.55, ease: 'out' },
    { t: 0.64, scaleX: 1, scaleY: 1, offsetY: 0, lowerLid: 0.5, ease: 'in' },
    { t: 0.75, scaleX: 1.16, scaleY: 0.86, offsetY: -0.06, lowerLid: 0.5, ease: 'out' },
    { t: 1, scaleX: 1, scaleY: 1.02, offsetY: 0.02, lowerLid: 0.42, ease: 'back' },
    { t: 1.3, ease: 'inOut' },
  ],
  // Two dips, each with a little squash, and a soft lid drop for warmth.
  nod: [
    { t: 0 },
    { t: 0.18, offsetY: -0.17, scaleX: 1.05, scaleY: 0.92, squint: 0.16, ease: 'inOut' },
    { t: 0.36, offsetY: 0.04, scaleX: 0.99, scaleY: 1.03, squint: 0.08, ease: 'inOut' },
    { t: 0.54, offsetY: -0.17, scaleX: 1.05, scaleY: 0.92, squint: 0.16, ease: 'inOut' },
    { t: 0.72, offsetY: 0.03, scaleX: 0.99, scaleY: 1.02, squint: 0.06, ease: 'inOut' },
    { t: 0.88, ease: 'inOut' },
  ],
  // Rise, flatten the eyes to lines for a beat, settle back down.
  shrug: [
    { t: 0 },
    { t: 0.24, offsetY: 0.15, scaleX: 0.97, scaleY: 1.06, eyeTall: 0.3, eyeWidth: 1.08, ease: 'out' },
    { t: 0.5, offsetY: 0.17, scaleX: 0.97, scaleY: 1.05, eyeTall: 0.11, eyeWidth: 1.12, ease: 'inOut' },
    { t: 0.82, offsetY: 0.16, scaleX: 0.97, scaleY: 1.05, eyeTall: 0.11, eyeWidth: 1.12, ease: 'linear' },
    { t: 1.15, ease: 'inOut' },
  ],
  // Lean toward the thing being looked at; the near eye opens larger than the far one.
  peek: [
    { t: 0 },
    { t: 0.26, rotZ: -0.2, offsetX: 0.16, eyeShiftX: 0.012, leftEye: 1.22, rightEye: 0.86, ease: 'out' },
    { t: 0.72, rotZ: -0.23, offsetX: 0.19, eyeShiftX: 0.014, leftEye: 1.28, rightEye: 0.84, ease: 'inOut' },
    { t: 1.1, ease: 'inOut' },
  ],
  // The eyes travel down the face to look at the body, with a small dip to match.
  'look-at-self': [
    { t: 0 },
    { t: 0.3, eyeShiftY: 0.06, squint: 0.16, offsetY: -0.03, scaleY: 0.98, scaleX: 1.02, ease: 'out' },
    { t: 0.8, eyeShiftY: 0.08, squint: 0.2, offsetY: -0.04, scaleY: 0.98, scaleX: 1.02, ease: 'inOut' },
    { t: 1.15, ease: 'inOut' },
  ],
  // Puff up and ride one slow swell with the eyes content and half shut.
  proud: [
    { t: 0 },
    { t: 0.45, offsetY: 0.1, scaleX: 1.04, scaleY: 1.05, squint: 0.42, ease: 'inOut' },
    { t: 0.95, offsetY: 0.13, scaleX: 1.05, scaleY: 1.06, squint: 0.48, ease: 'inOut' },
    { t: 1.45, offsetY: 0.02, scaleX: 1.01, scaleY: 1.01, squint: 0.3, ease: 'inOut' },
    { t: 1.75, ease: 'inOut' },
  ],
  // Lean in and rock, smiling with the lower lids up: a whole-body goodbye.
  wave: [
    { t: 0 },
    { t: 0.2, rotZ: -0.26, offsetX: 0.11, lowerLid: 0.3, ease: 'out' },
    { t: 0.44, rotZ: 0.22, offsetX: -0.09, lowerLid: 0.36, ease: 'inOut' },
    { t: 0.66, rotZ: -0.24, offsetX: 0.1, lowerLid: 0.36, ease: 'inOut' },
    { t: 0.88, rotZ: 0.18, offsetX: -0.07, lowerLid: 0.34, ease: 'inOut' },
    { t: 1.12, rotZ: -0.1, offsetX: 0.04, lowerLid: 0.28, ease: 'inOut' },
    { t: 1.4, ease: 'inOut' },
  ],
  // Start shut, blink open with one settling blink, then turn to look left and right.
  wake: [
    { t: 0, squint: 1, scaleX: 1.05, scaleY: 0.93 },
    { t: 0.3, squint: 0.97, scaleX: 1.03, scaleY: 0.95, ease: 'inOut' },
    { t: 0.52, squint: 0, scaleX: 0.98, scaleY: 1.04, ease: 'out' },
    { t: 0.66, squint: 0.55, ease: 'in' },
    { t: 0.8, squint: 0, ease: 'out' },
    { t: 1.2, rotY: -0.2, eyeShiftX: -0.015, ease: 'inOut' },
    { t: 1.68, rotY: 0.2, eyeShiftX: 0.015, ease: 'inOut' },
    { t: 2.05, ease: 'inOut' },
  ],
  // A fast jelly wobble that trades width for height each swing and decays.
  wiggle: [
    { t: 0 },
    { t: 0.1, offsetX: 0.11, rotZ: -0.13, scaleX: 1.07, scaleY: 0.94, lowerLid: 0.26, ease: 'out' },
    { t: 0.23, offsetX: -0.1, rotZ: 0.12, scaleX: 0.94, scaleY: 1.06, lowerLid: 0.32, ease: 'inOut' },
    { t: 0.35, offsetX: 0.08, rotZ: -0.09, scaleX: 1.05, scaleY: 0.96, lowerLid: 0.32, ease: 'inOut' },
    { t: 0.47, offsetX: -0.05, rotZ: 0.06, scaleX: 0.97, scaleY: 1.03, lowerLid: 0.26, ease: 'inOut' },
    { t: 0.62, ease: 'inOut' },
  ],
};

export const NAMES = [
  'wake', 'wiggle', 'nod', 'shrug', 'brace', 'surprised',
  'look-at-self', 'cheer', 'proud', 'peek', 'wave',
];

function fillPose(k: Keyframe): Pose {
  const p = { ...IDLE };
  for (const c of CHANNELS) { const v = k[c]; if (v !== undefined) p[c] = v; }
  return p;
}

export function poseAt(track: Keyframe[], time: number): Pose {
  if (track.length === 0) return { ...IDLE };
  let i = 0;
  while (i < track.length - 1 && time >= track[i + 1].t) i++;
  if (i === track.length - 1) return fillPose(track[i]);
  const a = fillPose(track[i]);
  const b = fillPose(track[i + 1]);
  const span = track[i + 1].t - track[i].t;
  const x = span > 0 ? (time - track[i].t) / span : 1;
  const k = EASES[track[i + 1].ease ?? 'inOut'](Math.min(1, Math.max(0, x)));
  const out = { ...IDLE };
  for (const c of CHANNELS) out[c] = a[c] + (b[c] - a[c]) * k;
  return out;
}

export interface ReactionPlayer {
  play(name: string): void;
  update(dt: number): Pose;
  readonly playing: string | null;
}

export function createReactionPlayer(): ReactionPlayer {
  let track: Keyframe[] | null = null;
  let name: string | null = null;
  let time = 0;
  return {
    play(n: string): void {
      const t = REACTIONS[n];
      if (!t || t.length === 0) return;
      track = t; name = n; time = 0;
    },
    update(dt: number): Pose {
      if (!track) return { ...IDLE };
      time += dt;
      if (time >= track[track.length - 1].t) { track = null; name = null; return { ...IDLE }; }
      return poseAt(track, time);
    },
    get playing(): string | null { return name; },
  };
}

const clamp01 = (v: number): number => Math.min(1, Math.max(0, v));

// The pose channels that are eye-texture settings; eyeShiftX and the per-eye sizes are read
// straight from the pose by the skin painter.
export function eyesWithPose(base: EyeSettings, p: Pose): EyeSettings {
  return {
    ...base,
    height: base.height + p.eyeShiftY,
    width: base.width * p.eyeWidth,
    tall: base.tall * p.eyeTall,
    tilt: base.tilt + p.eyeTilt,
    squint: clamp01(base.squint + p.squint),
    lowerLid: clamp01(base.lowerLid + p.lowerLid),
  };
}
