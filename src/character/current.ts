import { installReactHook } from './neutrino.ts';
import type { Neutrino } from './neutrino.ts';

let active: Neutrino | null = null;

export function currentNeutrino(): Neutrino | null {
  return active;
}

export function setCurrentNeutrino(n: Neutrino | null): void {
  active = n;
}

const relay: Pick<Neutrino, 'react'> = {
  react(name) { active?.react(name); },
};

// The hook outlives every level, so it forwards to whichever character is on stage.
export function installCurrentReactHook(): void {
  installReactHook(relay as Neutrino);
}
