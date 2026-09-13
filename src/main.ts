import './style.css';
import { Stage } from './render/stage.ts';
import { CONFIG } from './character/config.ts';

const stage = new Stage(document.getElementById('stage')!);
stage.applyLighting(CONFIG.light);
stage.setBloom(CONFIG.post);

function frame(): void {
  stage.render();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
