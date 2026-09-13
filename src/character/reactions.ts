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
