export const DESKTOP_FOV = 26;
const WIDE_ASPECT = 1.5;
const MAX_FOV = 60;

/** Vertical fov that keeps the 3:2 horizontal view on narrower screens, so portrait shows what landscape shows. */
export function portraitFov(aspect: number, base: number = DESKTOP_FOV): number {
  if (aspect >= WIDE_ASPECT) return base;
  const half = Math.atan(Math.tan((base * Math.PI) / 360) * (WIDE_ASPECT / aspect));
  return Math.min((half * 360) / Math.PI, MAX_FOV);
}
