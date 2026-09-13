import { isTouch } from '../input/device.ts';

export const HINT_IDS = ['hold', 'press', 'continue', 'steer', 'hit', 'pick', 'sort'] as const;
export type HintId = (typeof HINT_IDS)[number];

const KEYBOARD: Record<HintId, string> = {
  hold: 'Hold Space',
  press: 'Press Space',
  continue: 'Space to continue',
  steer: 'Arrow keys to steer',
  hit: 'Press Space to hit the electron',
  pick: 'Arrow keys to move, Space to pick.',
  sort: 'Press E for an electron, M for a muon.',
};

const TOUCH: Record<HintId, string> = {
  hold: 'Hold anywhere',
  press: 'Tap anywhere',
  continue: 'Tap to continue',
  steer: 'Hold left or right to steer',
  hit: 'Tap to hit the electron',
  pick: 'Tap the tile that is you.',
  sort: 'Tap Electron or Muon.',
};

/** Control wording for a prompt or card, phrased for the device's input (D-030). */
export function hint(id: HintId): string {
  return (isTouch() ? TOUCH : KEYBOARD)[id];
}
