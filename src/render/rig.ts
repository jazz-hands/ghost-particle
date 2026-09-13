import { Vector3 } from 'three';
import type { PerspectiveCamera } from 'three';

export type Vec3Like = { x: number; y: number; z: number } | [number, number, number];

export function prefersReducedMotion(): boolean {
  return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function read(v: Vec3Like, into: Vector3): Vector3 {
  return Array.isArray(v) ? into.set(v[0], v[1], v[2]) : into.set(v.x, v.y, v.z);
}

function smoothstep(u: number): number {
  return u * u * (3 - 2 * u);
}

export class CameraRig {
  private readonly camera: PerspectiveCamera;
  private readonly pos = new Vector3();
  private readonly look = new Vector3();
  private readonly fromPos = new Vector3();
  private readonly fromLook = new Vector3();
  private readonly toPos = new Vector3();
  private readonly toLook = new Vector3();
  private readonly scratch = new Vector3();
  private elapsed = 0;
  private duration = 0;
  private arrive: (() => void) | null = null;
  private amount = 0;

  constructor(camera: PerspectiveCamera) {
    this.camera = camera;
    this.pos.copy(camera.position);
  }

  set(pos: Vec3Like, look: Vec3Like): void {
    this.duration = 0;
    this.arrive = null;
    read(pos, this.pos);
    read(look, this.look);
    this.apply();
  }

  /** A second call replaces the first; the first promise never resolves. */
  moveTo(pos: Vec3Like, look: Vec3Like, seconds: number): Promise<void> {
    this.fromPos.copy(this.pos);
    this.fromLook.copy(this.look);
    read(pos, this.toPos);
    read(look, this.toLook);
    this.elapsed = 0;
    this.duration = Math.max(seconds, 0);
    return new Promise<void>((resolve) => { this.arrive = resolve; });
  }

  shake(amount: number): void {
    this.amount = prefersReducedMotion() ? 0 : amount;
  }

  update(dt: number): void {
    if (this.duration > 0) {
      this.elapsed += dt;
      const u = Math.min(this.elapsed / this.duration, 1);
      const e = smoothstep(u);
      this.pos.lerpVectors(this.fromPos, this.toPos, e);
      this.look.lerpVectors(this.fromLook, this.toLook, e);
      if (u === 1) {
        this.duration = 0;
        const arrive = this.arrive;
        this.arrive = null;
        arrive?.();
      }
    }
    this.apply();
  }

  private apply(): void {
    this.scratch.copy(this.pos);
    if (this.amount > 0) {
      this.scratch.x += (Math.random() * 2 - 1) * this.amount;
      this.scratch.y += (Math.random() * 2 - 1) * this.amount;
    }
    this.camera.position.copy(this.scratch);
    this.camera.lookAt(this.look);
  }
}
