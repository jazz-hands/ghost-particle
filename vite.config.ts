import { defineConfig } from 'vite';

export default defineConfig({
  // D-014: the dev server may be reached through the exe.dev proxy.
  server: { host: true, allowedHosts: ['.exe.xyz'] },
});
