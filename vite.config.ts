import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { beasties } from 'vite-plugin-beasties'
import { contentSecurityPolicy } from './security/csp.ts'
import { inlineCriticalShell } from './scripts/inline-critical-shell.ts'
import { asyncCssForCsp } from './scripts/async-css-for-csp.ts'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    beasties({
      options: {
        preload: 'swap',
        pruneSource: true,
      },
    }),
    inlineCriticalShell(),
    asyncCssForCsp(),
  ],
  server: { port: 5173, strictPort: true },
  preview: {
    port: 4174,
    strictPort: true,
    headers: { 'Content-Security-Policy': contentSecurityPolicy },
  },
  build: { target: 'es2022' },
})
