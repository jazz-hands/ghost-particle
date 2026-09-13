import {
  AdditiveBlending, BackSide, CanvasTexture, CircleGeometry, Color, CylinderGeometry, DoubleSide,
  FogExp2, Group, InstancedMesh, Mesh, MeshBasicMaterial, MeshStandardMaterial, Object3D,
  RepeatWrapping, SRGBColorSpace,
} from 'three';

// 1 unit = 5 m. F-17: the tank is 39 m wide and 41 m tall.
export const R_TANK = 3.9;
export const H_TANK = 8.2;
export const WALL = 3.85;

// F-18: 11,129 inward-facing sensors, one InstancedMesh (D-027). The split between wall and
// end caps is by area, so the spacing is even everywhere.
const SENSOR_COUNT = 11129;
const WALL_COLUMNS = 151;
const WALL_ROWS = 50;
const SENSOR_RADIUS = 0.05;
const GLINT_RADIUS = 0.055;
const MAX_GLINTS = 1400;

// Deep blue-black water, lit only by what the sensors and the rings put into it.
const WATER = '#05131f';
// The fog is the depth cue and the only volume in the scene: a shade bluer than the shell, and
// thick enough that the far side of a 39 m tank reads as distance rather than as more wall.
const WATER_HAZE = '#0a2438';
const WATER_FOG = 0.085;
// Warm gold sensor faces with just enough emissive to glint below the bloom threshold.
const SENSOR_GOLD = '#c8913c';
const SENSOR_EMISSIVE = '#ffb347';
const SENSOR_EMISSIVE_INTENSITY = 0.6;
// A little per-sensor brightness spread so the wall glints instead of tiling.
const SENSOR_SPREAD = 0.3;
// Cherenkov blue-white: what a lit sensor and every ring share.
export const CHERENKOV_BLUE = '#bfe6ff';
const GLINT_OPACITY = 0.95;
// A sharp ring is thinner than the sensors are wide, so its glints get a floor to sit on.
const GLINT_BAND = 0.14;

// D-027: every ring is painted onto one canvas mapped to the inside of the cylinder, never
// built as geometry. The canvas is square-pixelled: as many pixels round as the wall is wide.
const CANVAS_W = 1024;
const CANVAS_H = Math.round((CANVAS_W * H_TANK) / (2 * Math.PI * R_TANK));
const PX = CANVAS_W / (2 * Math.PI * R_TANK);
const RING_SHELL = WALL - 0.06;

// Ring edges (F-22): an electron scatters and showers, so its edge is wide and soft; a muon
// punches through, so its edge is thin and crisp; ring 5 sits between the two on purpose.
const EDGES: Record<RingStyle, { width: number; core: number }> = {
  fuzzy: { width: 0.36, core: 0.42 },
  sharp: { width: 0.09, core: 1 },
  ambiguous: { width: 0.18, core: 0.62 },
};

export type RingStyle = 'fuzzy' | 'sharp' | 'ambiguous';

export interface PaintedRing {
  theta: number;
  y: number;
  radius: number;
  style: RingStyle;
  alpha: number;
}

export interface Tank {
  group: Group;
  fog: FogExp2;
  /** Repaints the wall: every ring on the canvas, and the sensors under each one brightened. */
  paint(rings: PaintedRing[]): void;
}

/** Canvas u runs round the wall the way the cylinder's own UVs do; v runs bottom to top. */
function canvasX(theta: number): number {
  const u = (Math.PI / 2 - theta) / (2 * Math.PI);
  return (u - Math.floor(u)) * CANVAS_W;
}

function canvasY(y: number): number {
  return (1 - (y + H_TANK / 2) / H_TANK) * CANVAS_H;
}

/** One ring: a soft annulus whose edge width and core brightness carry the particle (F-22). */
function paintRing(g: CanvasRenderingContext2D, ring: PaintedRing, cx: number): void {
  const { width, core } = EDGES[ring.style];
  const r = ring.radius * PX;
  const half = (width * PX) / 2;
  const outer = r + half;
  if (outer <= 0) return;
  const cy = canvasY(ring.y);
  const grad = g.createRadialGradient(cx, cy, 0, cx, cy, outer);
  const inner = Math.max((r - half) / outer, 0);
  const peak = r / outer;
  grad.addColorStop(0, 'rgba(191,230,255,0)');
  grad.addColorStop(inner, 'rgba(191,230,255,0)');
  grad.addColorStop(peak, `rgba(226,246,255,${core * ring.alpha})`);
  grad.addColorStop(1, 'rgba(191,230,255,0)');
  g.fillStyle = grad;
  g.fillRect(cx - outer, cy - outer, outer * 2, outer * 2);
}

function water(): MeshStandardMaterial {
  return new MeshStandardMaterial({ color: WATER, roughness: 0.85, metalness: 0, side: DoubleSide });
}

function cap(y: number): Mesh {
  const disc = new Mesh(new CircleGeometry(R_TANK, 64), water());
  disc.rotation.x = y > 0 ? Math.PI / 2 : -Math.PI / 2;
  disc.position.y = y;
  return disc;
}

/** Concentric rings of sensors filling one end cap, stopping the moment `count` is reached. */
function capPositions(y: number, count: number, spacing: number): [number, number, number][] {
  const spots: [number, number, number][] = [];
  for (let r = 1; spots.length < count; r += 1) {
    const radius = r * spacing;
    if (radius > R_TANK - spacing * 0.5) break;
    const n = Math.max(1, Math.round((2 * Math.PI * radius) / spacing));
    for (let i = 0; i < n && spots.length < count; i += 1) {
      const a = (i / n) * Math.PI * 2;
      spots.push([radius * Math.cos(a), y, radius * Math.sin(a)]);
    }
  }
  return spots;
}

export function createTank(): Tank {
  const group = new Group();
  const shell = new Mesh(new CylinderGeometry(R_TANK, R_TANK, H_TANK, 64, 1, true), water());
  shell.material.side = DoubleSide;
  group.add(shell, cap(H_TANK / 2), cap(-H_TANK / 2));

  const sensors = new InstancedMesh(
    new CircleGeometry(SENSOR_RADIUS, 12),
    new MeshStandardMaterial({
      color: SENSOR_GOLD,
      emissive: new Color(SENSOR_EMISSIVE),
      emissiveIntensity: SENSOR_EMISSIVE_INTENSITY,
      roughness: 0.35,
      metalness: 0.2,
    }),
    SENSOR_COUNT,
  );

  const gold = new Color(SENSOR_GOLD);
  const shade = new Color();
  const vary = (n: number): void => {
    shade.copy(gold).multiplyScalar(1 - SENSOR_SPREAD / 2 + Math.random() * SENSOR_SPREAD);
    sensors.setColorAt(n, shade);
  };

  const wallCount = WALL_COLUMNS * WALL_ROWS;
  const wallTheta = new Float32Array(wallCount);
  const wallY = new Float32Array(wallCount);
  const at = new Object3D();
  let i = 0;
  for (let c = 0; c < WALL_COLUMNS; c += 1) {
    const theta = (c / WALL_COLUMNS) * Math.PI * 2;
    for (let r = 0; r < WALL_ROWS; r += 1) {
      const y = -H_TANK / 2 + ((r + 0.5) / WALL_ROWS) * H_TANK;
      wallTheta[i] = theta;
      wallY[i] = y;
      at.position.set(WALL * Math.cos(theta), y, WALL * Math.sin(theta));
      at.lookAt(0, y, 0);
      at.updateMatrix();
      sensors.setMatrixAt(i, at.matrix);
      vary(i);
      i += 1;
    }
  }

  const capEach = Math.floor((SENSOR_COUNT - wallCount) / 2);
  const capSpacing = (2 * Math.PI * WALL) / WALL_COLUMNS;
  for (const [y, count] of [[H_TANK / 2 - 0.05, capEach], [-H_TANK / 2 + 0.05, SENSOR_COUNT - wallCount - capEach]] as const) {
    for (const [x, py, z] of capPositions(y, count, capSpacing)) {
      at.position.set(x, py, z);
      at.lookAt(x, y > 0 ? py - 1 : py + 1, z);
      at.updateMatrix();
      sensors.setMatrixAt(i, at.matrix);
      vary(i);
      i += 1;
    }
  }
  // Any leftovers (a cap ring that ran out of room) are parked flat at the centre, unseen.
  at.position.set(0, 0, 0);
  at.scale.setScalar(0);
  at.updateMatrix();
  for (; i < SENSOR_COUNT; i += 1) sensors.setMatrixAt(i, at.matrix);
  at.scale.setScalar(1);
  group.add(sensors);

  const glints = new InstancedMesh(
    new CircleGeometry(GLINT_RADIUS, 12),
    new MeshBasicMaterial({
      color: new Color(CHERENKOV_BLUE),
      transparent: true,
      opacity: GLINT_OPACITY,
      blending: AdditiveBlending,
      depthWrite: false,
    }),
    MAX_GLINTS,
  );
  glints.count = 0;
  glints.frustumCulled = false;
  group.add(glints);

  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_W;
  canvas.height = CANVAS_H;
  const paper = canvas.getContext('2d')!;
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.wrapS = RepeatWrapping;
  const wall = new Mesh(
    new CylinderGeometry(RING_SHELL, RING_SHELL, H_TANK, 64, 1, true),
    new MeshBasicMaterial({
      map: texture,
      transparent: true,
      blending: AdditiveBlending,
      side: BackSide,
      depthWrite: false,
    }),
  );
  wall.addEventListener('removed', () => texture.dispose());
  group.add(wall);

  return {
    group,
    fog: new FogExp2(WATER_HAZE, WATER_FOG),
    paint(rings) {
      paper.clearRect(0, 0, CANVAS_W, CANVAS_H);
      for (const ring of rings) {
        const cx = canvasX(ring.theta);
        // The seam is just another x: paint each ring three times so it can cross it.
        for (const offset of [-CANVAS_W, 0, CANVAS_W]) paintRing(paper, ring, cx + offset);
      }
      texture.needsUpdate = true;

      let lit = 0;
      for (const ring of rings) {
        const band = Math.max(EDGES[ring.style].width, GLINT_BAND);
        for (let s = 0; s < wallCount && lit < MAX_GLINTS; s += 1) {
          let da = wallTheta[s]! - ring.theta;
          da = Math.atan2(Math.sin(da), Math.cos(da));
          const d = Math.hypot(da * WALL, wallY[s]! - ring.y);
          const off = Math.abs(d - ring.radius) / band;
          if (off >= 1) continue;
          const t = wallTheta[s]!;
          at.position.set(WALL * Math.cos(t), wallY[s]!, WALL * Math.sin(t));
          at.lookAt(0, wallY[s]!, 0);
          at.updateMatrix();
          glints.setMatrixAt(lit, at.matrix);
          glints.setColorAt(lit, shade.set(CHERENKOV_BLUE).multiplyScalar((1 - off) * ring.alpha));
          lit += 1;
        }
      }
      glints.count = lit;
      glints.instanceMatrix.needsUpdate = true;
      if (glints.instanceColor) glints.instanceColor.needsUpdate = true;
    },
  };
}
