import type { PerspectiveCamera, Scene } from 'three';
import type { Hud } from '../hud/hud.ts';
import type { Keys } from '../input/keys.ts';
import type { CameraRig } from '../render/rig.ts';

export interface LevelContext {
  scene: Scene;
  camera: PerspectiveCamera;
  hud: Hud;
  keys: Keys;
  rig: CameraRig;
  done: () => void;
}

// D-018: levels own their three.js objects and dispose them in exit().
export interface Level {
  readonly id: number;
  enter(ctx: LevelContext): void;
  update(dt: number): void;
  exit(): void;
  // Advances one beat. Skipping a whole level is LevelManager.skip().
  next(): void;
}
