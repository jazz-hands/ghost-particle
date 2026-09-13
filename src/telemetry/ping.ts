// Play pings: one GET per event with the play time in the query. nginx answers empty and
// counts the path in the visits log; nothing else is sent and nothing is stored in the browser.

export function pingPath(event: string, seconds: number): string {
  return `/ping/${event}?s=${Math.max(0, Math.floor(seconds))}`;
}

export function ping(event: string): void {
  if (typeof fetch !== 'function') return;
  void fetch(pingPath(event, performance.now() / 1000), { cache: 'no-store', keepalive: true }).catch(() => {});
}
