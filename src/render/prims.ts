import {
  BackSide, BoxGeometry, ConeGeometry, CylinderGeometry, DoubleSide, Mesh,
  MeshStandardMaterial, PlaneGeometry, SphereGeometry, TorusGeometry,
} from 'three';
import type { Object3D } from 'three';
import { TINTS } from '../content/flavors.ts';
import type { Flavor } from '../content/flavors.ts';

export const GREY = '#9aa4ad';

export interface PrimOpts {
  opacity?: number;
  color?: string;
}

function material(o?: PrimOpts): MeshStandardMaterial {
  const opacity = o?.opacity ?? 1;
  return new MeshStandardMaterial({
    color: o?.color ?? GREY,
    opacity,
    transparent: opacity < 1,
  });
}

export function sphere(radius: number, o?: PrimOpts): Mesh {
  return new Mesh(new SphereGeometry(radius, 32, 16), material(o));
}

export function box(w: number, h: number, d: number, o?: PrimOpts): Mesh {
  return new Mesh(new BoxGeometry(w, h, d), material(o));
}

export function plane(w: number, h: number, o?: PrimOpts): Mesh {
  const mesh = new Mesh(new PlaneGeometry(w, h), material(o));
  mesh.material.side = DoubleSide;
  return mesh;
}

export function ring(radius: number, tube: number, o?: PrimOpts): Mesh {
  return new Mesh(new TorusGeometry(radius, tube, 12, 48), material(o));
}

export function cone(radius: number, height: number, o?: PrimOpts): Mesh {
  return new Mesh(new ConeGeometry(radius, height, 24), material(o));
}

export function cylinderInside(radius: number, height: number, o?: PrimOpts): Mesh {
  const mesh = new Mesh(new CylinderGeometry(radius, radius, height, 48, 1, true), material(o));
  mesh.material.side = BackSide;
  return mesh;
}

export function neutrino(): Mesh {
  return sphere(0.5, { opacity: 0.45 });
}

export function tint(mesh: Mesh, f: Flavor | null): void {
  for (const m of materialsOf(mesh)) m.color.set(f ? TINTS[f] : GREY);
}

export function setOpacity(mesh: Mesh, opacity: number): void {
  for (const m of materialsOf(mesh)) {
    m.opacity = opacity;
    m.transparent = opacity < 1;
  }
}

export function disposeGroup(group: Object3D): void {
  group.traverse((child) => {
    const mesh = child as Partial<Mesh>;
    mesh.geometry?.dispose();
    if (!mesh.material) return;
    for (const m of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) m.dispose();
  });
  group.removeFromParent();
  group.clear();
}

function materialsOf(mesh: Mesh): MeshStandardMaterial[] {
  const list = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  return list.filter((m): m is MeshStandardMaterial => m instanceof MeshStandardMaterial);
}
