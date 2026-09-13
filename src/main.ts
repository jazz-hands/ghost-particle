import './style.css';
import { Stage } from './render/stage.ts';
import { CONFIG } from './character/config.ts';
import { LevelManager } from './levels/manager.ts';
import { Hud } from './hud/hud.ts';
import { Keys } from './input/keys.ts';
import { CameraRig } from './render/rig.ts';
import { LEVELS } from './levels/index.ts';
import { parseFlags } from './debug/flags.ts';
import { installGhostHook } from './debug/ghost.ts';
import { installCurrentReactHook } from './character/current.ts';
import { mountDebug } from './debug/gui.ts';

const flags = parseFlags(location.search, LEVELS.length);

const stage = new Stage(document.getElementById('stage')!);
stage.applyLighting(CONFIG.light);
stage.setBloom(CONFIG.post);

const keys = new Keys();
const hud = new Hud(document.getElementById('hud')!, keys);
const rig = new CameraRig(stage.camera);

const manager = new LevelManager(LEVELS, { scene: stage.scene, camera: stage.camera, hud, keys, rig });
installGhostHook(manager);
installCurrentReactHook();
const debug = flags.debug ? mountDebug(manager) : null;
manager.start(flags.level);

let last = performance.now();
function frame(now: number): void {
  const dt = Math.min((now - last) / 1000, 0.1);
  last = now;
  manager.update(dt);
  rig.update(dt);
  hud.counter.update();
  stage.render();
  debug?.update();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
