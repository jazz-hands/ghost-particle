import type { BloomSettings, LightSettings } from '../render/stage.ts';
import raw from './config.json' with { type: 'json' };

export type Flavor = 'electron' | 'muon' | 'tau';

export interface BodySettings {
  scaleX: number; scaleY: number; colorDepth: number; opacity: number; roughness: number;
  clearcoat: number; clearcoatRoughness: number; sheen: number; sheenColor: string; emissiveBoost: number;
}

export interface EyeSettings {
  spacing: number; height: number; width: number; tall: number; tilt: number; color: string; roughness: number;
  highlight: boolean; hlSize: number; hlTall: number; hlOffsetX: number; hlOffsetY: number; hlColor: string;
  squint: number; lowerLid: number;
}

export interface PostSettings extends BloomSettings {
  eyeGlow: number; rimShell: boolean; rimOpacity: number; rimScale: number;
  halo: boolean; haloSize: number; haloOpacity: number;
}

export interface CharacterConfig {
  flavor: Flavor;
  body: BodySettings;
  eyes: EyeSettings;
  light: LightSettings;
  post: PostSettings;
  view: { turn: boolean; idleBob: boolean };
}

// D-029: the JSON is the tuner's output, pasted in whole.
export const CONFIG = raw as CharacterConfig;
