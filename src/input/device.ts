/** True on devices whose primary pointer is a finger. Read at call time, never at import. */
export function isTouch(): boolean {
  return typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches;
}
