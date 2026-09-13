import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import Stats from 'three/addons/libs/stats.module.js';
import type { LevelManager } from '../levels/manager.ts';

export interface DebugPanel {
  update(): void;
}

// D-017: mounted only when the URL carries ?debug.
export function mountDebug(manager: LevelManager): DebugPanel {
  const stats = new Stats();
  document.body.append(stats.dom);

  const gui = new GUI({ title: 'Ghost Particle debug' });
  const state = { level: manager.level };
  const levelDisplay = gui.add(state, 'level').disable();
  gui.add({ next: () => manager.next() }, 'next').name('next beat');

  return {
    update() {
      stats.update();
      if (state.level !== manager.level) {
        state.level = manager.level;
        levelDisplay.updateDisplay();
      }
    },
  };
}
