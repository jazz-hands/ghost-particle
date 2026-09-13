import type { PerspectiveCamera, Scene } from 'three';

export interface LevelContext {
  scene: Scene;
  camera: PerspectiveCamera;
  done: () => void;
}

// D-018: levels own their three.js objects and dispose them in exit().
export interface Level {
  readonly id: number;
  enter(ctx: LevelContext): void;
  update(dt: number): void;
  exit(): void;
  next(): void;
}
