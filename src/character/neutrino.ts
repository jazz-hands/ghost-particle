import * as THREE from 'three';
import { CONFIG, type CharacterConfig, type EyeSettings, type Flavor } from './config.ts';
import { createReactionPlayer, eyesWithPose, IDLE, type Pose } from './reactions.ts';

// D-011. Design choices with no physical meaning; the credits say so.
const TINTS: Record<Flavor, string> = { electron: '#5ee3ff', muon: '#b58cff', tau: '#ff9f6b' };

const W = 1024;
const H = 512;
const KINDS = ['map', 'rough', 'emissive'] as const;
type SkinKind = (typeof KINDS)[number];

interface Skin { ctx: CanvasRenderingContext2D; tex: THREE.CanvasTexture }

export interface Neutrino {
  group: THREE.Group;
  react(name: string): void;
  update(dt: number): void;
  setFlavor(f: Flavor): void;
  dispose(): void;
}

const scaleHex = (hex: string, k: number): string => '#' + new THREE.Color(hex).multiplyScalar(k).getHexString();
const greyHex = (v: number): string => {
  const h = Math.round(Math.min(1, Math.max(0, v)) * 255).toString(16).padStart(2, '0');
  return '#' + h + h + h;
};

function haloTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d')!;
  const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  gr.addColorStop(0, 'rgba(255,255,255,1)');
  gr.addColorStop(0.35, 'rgba(255,255,255,0.35)');
  gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr;
  g.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}

export function createNeutrino(config: CharacterConfig = CONFIG): Neutrino {
  let flavor = config.flavor;

  const skins = {} as Record<SkinKind, Skin>;
  for (const kind of KINDS) {
    const c = document.createElement('canvas');
    c.width = W;
    c.height = H;
    const tex = new THREE.CanvasTexture(c);
    if (kind !== 'rough') tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    skins[kind] = { ctx: c.getContext('2d')!, tex };
  }

  // Front of the sphere is u = 0.25, equator v = 0.5; near the equator a canvas circle is a
  // sphere circle. Every expression is a repaint of this skin (D-029).
  function paintSkin(kind: SkinKind, e: EyeSettings, p: Pose): void {
    const g = skins[kind].ctx;
    const tint = TINTS[flavor];
    g.fillStyle = kind === 'map' ? tint : kind === 'emissive' ? scaleHex(tint, config.body.emissiveBoost) : greyHex(config.body.roughness);
    g.fillRect(0, 0, W, H);
    const y = e.height * H;
    const xs = [(0.25 + p.eyeShiftX - e.spacing) * W, (0.25 + p.eyeShiftX + e.spacing) * W];
    xs.forEach((x, i) => {
      const side = i === 0 ? -1 : 1;
      const k = i === 0 ? p.leftEye : p.rightEye;
      const w = e.width * k;
      const tall = e.tall * k;
      g.save();
      g.translate(x, y);
      g.rotate(side * e.tilt);
      // Lids clip the eye: squint eats it from the top, lowerLid from the bottom (the cheer arc).
      const lid = e.squint * tall * 2;
      const lower = e.lowerLid * tall * 2;
      g.beginPath();
      g.rect(-w * 2, -tall - 2 + lid, w * 4, tall * 2 + 4 - lid - lower);
      g.clip();
      g.fillStyle = kind === 'map' ? e.color : kind === 'emissive' ? '#000000' : greyHex(e.roughness);
      g.beginPath();
      g.ellipse(0, 0, w, tall, 0, 0, Math.PI * 2);
      g.fill();
      if (e.highlight && (kind === 'map' || kind === 'emissive')) {
        g.fillStyle = kind === 'map' ? e.hlColor : scaleHex(e.hlColor, config.post.eyeGlow);
        g.beginPath();
        g.ellipse(e.hlOffsetX * k, e.hlOffsetY * k, e.hlSize * k, e.hlTall * k, 0, 0, Math.PI * 2);
        g.fill();
      }
      g.restore();
    });
    skins[kind].tex.needsUpdate = true;
  }

  let drawn = '';
  function drawSkins(p: Pose): void {
    const e = eyesWithPose(config.eyes, p);
    const sig = [e.height, e.width, e.tall, e.tilt, e.squint, e.lowerLid, p.eyeShiftX, p.leftEye, p.rightEye].join();
    if (sig === drawn) return;
    drawn = sig;
    for (const kind of KINDS) paintSkin(kind, e, p);
  }

  const b = config.body;
  const geo = new THREE.SphereGeometry(1, 128, 96);
  const mat = new THREE.MeshPhysicalMaterial({
    transparent: true, metalness: 0, roughness: 1, emissive: new THREE.Color(0xffffff),
    map: skins.map.tex, roughnessMap: skins.rough.tex, emissiveMap: skins.emissive.tex,
    opacity: b.opacity, clearcoat: b.clearcoat, clearcoatRoughness: b.clearcoatRoughness,
    sheen: b.sheen, sheenColor: new THREE.Color(b.sheenColor), emissiveIntensity: 1,
  });
  const body = new THREE.Mesh(geo, mat);

  const p = config.post;
  const rimMat = new THREE.MeshBasicMaterial({
    transparent: true, blending: THREE.AdditiveBlending, side: THREE.BackSide, depthWrite: false,
    opacity: p.rimOpacity,
  });
  const rimShell = new THREE.Mesh(geo, rimMat);
  rimShell.visible = p.rimShell;
  rimShell.scale.setScalar(p.rimScale);
  body.add(rimShell);

  const haloTex = haloTexture();
  const haloMat = new THREE.SpriteMaterial({
    map: haloTex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
    opacity: p.haloOpacity,
  });
  const halo = new THREE.Sprite(haloMat);
  halo.visible = p.halo;
  halo.position.z = -0.6;
  halo.scale.setScalar(p.haloSize);
  body.add(halo);

  const group = new THREE.Group();
  group.add(body);

  function applyTint(): void {
    const tint = TINTS[flavor];
    mat.color.set('#ffffff').lerp(new THREE.Color(tint), b.colorDepth);
    rimMat.color.set(tint);
    haloMat.color.set(tint);
  }
  applyTint();
  drawSkins(IDLE);

  const player = createReactionPlayer();
  let clock = 0;

  return {
    group,
    react(name: string): void {
      player.play(name);
    },
    update(dt: number): void {
      clock += dt;
      const pose = player.update(dt);
      drawSkins(pose);
      const bob = config.view.idleBob ? 1 + Math.sin(clock * 2) * 0.02 : 1;
      body.scale.set(b.scaleX * pose.scaleX * bob, b.scaleY * pose.scaleY / bob, 1);
      body.position.set(pose.offsetX, (config.view.idleBob ? Math.sin(clock * 2) * 0.05 : 0) + pose.offsetY, 0);
      body.rotation.set(0, (config.view.turn ? Math.sin(clock * 0.4) * 0.6 : 0) + pose.rotY, pose.rotZ);
    },
    setFlavor(f: Flavor): void {
      flavor = f;
      applyTint();
      drawn = '';
      drawSkins(IDLE);
    },
    dispose(): void {
      geo.dispose();
      mat.dispose();
      rimMat.dispose();
      haloMat.dispose();
      haloTex.dispose();
      for (const kind of KINDS) skins[kind].tex.dispose();
      group.remove(body);
    },
  };
}

declare module '../debug/ghost.ts' {
  interface GhostHook {
    react?(name: string): void;
  }
}

export function installReactHook(n: Neutrino): void {
  const hook = window.ghost;
  if (!hook) return;
  hook.react = (name) => n.react(name);
}
