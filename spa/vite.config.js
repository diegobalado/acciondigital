import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

function getContentType(filePath) {
  const extension = path.extname(filePath).toLowerCase()

  if (extension === '.json') return 'application/json; charset=utf-8'
  if (extension === '.jpg' || extension === '.jpeg') return 'image/jpeg'
  if (extension === '.png') return 'image/png'
  if (extension === '.gif') return 'image/gif'
  if (extension === '.svg') return 'image/svg+xml'
  if (extension === '.webp') return 'image/webp'
  if (extension === '.css') return 'text/css; charset=utf-8'
  if (extension === '.js') return 'text/javascript; charset=utf-8'

  return 'application/octet-stream'
}

function legacyAssetsBridge() {
  const legacyAssetsRoot = path.resolve(__dirname, '../assets')

  return {
    name: 'legacy-assets-bridge',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const requestUrl = req.url || ''
        if (!requestUrl.startsWith('/assets/')) {
          next()
          return
        }

        const requestPath = requestUrl.split('?')[0]
        const relativeAssetPath = requestPath.replace(/^\/assets\//, '')
        const resolvedAssetPath = path.resolve(legacyAssetsRoot, relativeAssetPath)

        if (!resolvedAssetPath.startsWith(legacyAssetsRoot)) {
          res.statusCode = 403
          res.end('Forbidden')
          return
        }

        if (!fs.existsSync(resolvedAssetPath) || !fs.statSync(resolvedAssetPath).isFile()) {
          next()
          return
        }

        res.setHeader('Content-Type', getContentType(resolvedAssetPath))
        fs.createReadStream(resolvedAssetPath).pipe(res)
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte(), legacyAssetsBridge()],
  resolve: {
    conditions: ['browser']
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
    include: ['src/**/*.{test,spec}.{js,ts}']
  }
})
