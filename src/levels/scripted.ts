import { Group } from 'three';
import type { Scene } from 'three';
import { Beats } from './beats.ts';
import type { Level, LevelContext } from './types.ts';
import type { LevelFactory } from './manager.ts';
import type { Hud } from '../hud/hud.ts';
import type { Keys } from '../input/keys.ts';
import type { CameraRig } from '../render/rig.ts';
import { disposeGroup } from '../render/prims.ts';

export interface Scripted {
  ctx: LevelContext;
  b: Beats;
  hud: Hud;
  keys: Keys;
  rig: CameraRig;
  scene: Scene;
  group: Group;
  time: number;
  onUpdate(fn: (dt: number) => void): void;
}

// Subscriptions made through the level's keys are dropped when the level exits.
function scopeKeys(keys: Keys, subs: (() => void)[]): Keys {
  const scoped: Keys = Object.create(keys);
  scoped.onPress = (code, fn) => track(keys.onPress(code, fn), subs);
  scoped.onRelease = (code, fn) => track(keys.onRelease(code, fn), subs);
  return scoped;
}

function track(off: () => void, subs: (() => void)[]): () => void {
  subs.push(off);
  return off;
}

export function scriptedLevel(id: number, script: (s: Scripted) => Promise<void>): LevelFactory {
  return () => {
    let live: {
      s: Scripted;
      b: Beats;
      hud: Hud;
      scene: Scene;
      group: Group;
      hooks: ((dt: number) => void)[];
      subs: (() => void)[];
    } | null = null;

    return {
      id,
      enter(ctx) {
        const group = new Group();
        ctx.scene.add(group);
        const b = new Beats(ctx.hud, ctx.keys);
        const hooks: ((dt: number) => void)[] = [];
        const subs: (() => void)[] = [];
        const s: Scripted = {
          ctx,
          b,
          hud: ctx.hud,
          keys: scopeKeys(ctx.keys, subs),
          rig: ctx.rig,
          scene: ctx.scene,
          group,
          time: 0,
          onUpdate(fn) { hooks.push(fn); },
        };
        live = { s, b, hud: ctx.hud, scene: ctx.scene, group, hooks, subs };
        void script(s).then(() => { if (!b.cancelled) ctx.done(); });
      },
      update(dt) {
        if (!live) return;
        live.s.time += dt;
        live.b.update(dt);
        for (const fn of [...live.hooks]) fn(dt);
      },
      exit() {
        if (!live) return;
        live.b.cancel();
        live.hud.clear();
        live.scene.fog = null;
        disposeGroup(live.group);
        for (const off of live.subs) off();
        live = null;
      },
      next() { live?.b.next(); },
    } satisfies Level;
  };
}
