import build from '@hono/vite-build/cloudflare-pages'
import devServer from '@hono/vite-dev-server'
import adapter from '@hono/vite-dev-server/cloudflare'
import { defineConfig } from 'vite'
import { resolve } from 'path'
import fs from 'fs'

// Plugin to copy public/upload_files to dist/upload_files
const copyUploadFiles = () => ({
  name: 'copy-upload-files',
  closeBundle: async () => {
    const srcDir = resolve(__dirname, 'public/upload_files')
    const destDir = resolve(__dirname, 'dist/upload_files')
    if (fs.existsSync(srcDir)) {
      fs.mkdirSync(destDir, { recursive: true })
      const files = fs.readdirSync(srcDir)
      for (const file of files) {
        fs.copyFileSync(resolve(srcDir, file), resolve(destDir, file))
      }
      console.log('✓ Copied upload_files to dist/')
    }
  }
})

export default defineConfig({
  plugins: [
    build(),
    devServer({
      adapter,
      entry: 'src/index.tsx'
    }),
    copyUploadFiles()
  ],
  publicDir: 'public'
})
