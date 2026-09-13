import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

export interface LightSettings {
  keyIntensity: number; keyX: number; keyY: number; keyZ: number;
  fillIntensity: number; fillColor: string;
  rimIntensity: number; rimX: number; rimY: number; rimZ: number;
  envIntensity: number; exposure: number;
}

export interface BloomSettings {
  bloom: boolean; bloomThreshold: number; bloomStrength: number; bloomRadius: number;
}

export const BACKGROUND = '#070b1a';

export class Stage {
  readonly renderer: THREE.WebGLRenderer;
  readonly scene = new THREE.Scene();
  readonly camera = new THREE.PerspectiveCamera(26, 1, 0.1, 100);
  readonly key = new THREE.DirectionalLight(0xffffff, 1);
  readonly fill = new THREE.DirectionalLight(0xffffff, 1);
  readonly rim = new THREE.DirectionalLight(0xffffff, 1);
  private readonly composer: EffectComposer;
  private readonly bloom: UnrealBloomPass;

  constructor(container: HTMLElement) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.append(this.renderer.domElement);

    this.scene.background = new THREE.Color(BACKGROUND);
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    this.camera.position.set(0, 0.3, 6.5);
    this.scene.add(this.key, this.fill, this.rim);

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.25, 0.3, 0.95);
    this.composer.addPass(this.bloom);
    this.composer.addPass(new OutputPass());

    this.resize();
    addEventListener('resize', () => this.resize());
  }

  applyLighting(l: LightSettings): void {
    this.key.intensity = l.keyIntensity;
    this.key.position.set(l.keyX, l.keyY, l.keyZ);
    this.fill.intensity = l.fillIntensity;
    this.fill.color.set(l.fillColor);
    this.fill.position.set(-5, 1, 3);
    this.rim.intensity = l.rimIntensity;
    this.rim.position.set(l.rimX, l.rimY, l.rimZ);
    this.scene.environmentIntensity = l.envIntensity;
    this.renderer.toneMappingExposure = l.exposure;
  }

  setBloom(p: BloomSettings): void {
    this.bloom.enabled = p.bloom;
    this.bloom.threshold = p.bloomThreshold;
    this.bloom.strength = p.bloomStrength;
    this.bloom.radius = p.bloomRadius;
  }

  resize(): void {
    const w = innerWidth;
    const h = innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    this.composer.setSize(w, h);
  }

  render(): void {
    this.composer.render();
  }
}
