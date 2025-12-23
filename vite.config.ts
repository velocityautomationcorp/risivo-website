import build from '@hono/vite-build/cloudflare-pages'
import devServer from '@hono/vite-dev-server'
import adapter from '@hono/vite-dev-server/cloudflare'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    build({
      external: ['bcryptjs']
    }),
    devServer({
      adapter,
      entry: 'src/index.tsx'
    })
  ],
  publicDir: 'public',
  build: {
    rollupOptions: {
      external: ['bcryptjs']
    },
    copyPublicDir: true
  },
  ssr: {
    external: ['bcryptjs'],
    noExternal: false
  }
})
