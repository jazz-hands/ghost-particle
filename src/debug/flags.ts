export interface Flags {
  level: number;
  debug: boolean;
}

export function parseFlags(search: string, levelCount: number): Flags {
  const params = new URLSearchParams(search);
  const raw = Number(params.get('level'));
  const level = Number.isInteger(raw) && raw >= 1 && raw <= levelCount ? raw : 1;
  return { level, debug: params.has('debug') };
}
