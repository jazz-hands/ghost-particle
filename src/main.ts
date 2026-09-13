import './style.css';
import { Stage } from './render/stage.ts';
import { CONFIG } from './character/config.ts';
import { LevelManager } from './levels/manager.ts';
import { LEVELS } from './levels/index.ts';
import { parseFlags } from './debug/flags.ts';
import { installGhostHook } from './debug/ghost.ts';

const flags = parseFlags(location.search, LEVELS.length);

const stage = new Stage(document.getElementById('stage')!);
stage.applyLighting(CONFIG.light);
stage.setBloom(CONFIG.post);

const manager = new LevelManager(LEVELS, { scene: stage.scene, camera: stage.camera });
installGhostHook(manager);
manager.start(flags.level);

let last = performance.now();
function frame(now: number): void {
  const dt = Math.min((now - last) / 1000, 0.1);
  last = now;
  manager.update(dt);
  stage.render();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
