import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'

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

function isSupportedImageFile(fileName) {
  return /\.(jpg|jpeg|png|webp)$/i.test(fileName)
}

function toEventTitleFromDirectoryName(directoryName) {
  return directoryName
    .replace(/^\d+_/, '')
    .replace(/[_-]+/g, ' ')
    .trim()
}

function listLegacyEventDirectories(eventsRoot) {
  if (!fs.existsSync(eventsRoot)) {
    return []
  }

  return fs
    .readdirSync(eventsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((left, right) => right.localeCompare(left, 'es'))
}

function readLegacyEventGallery(eventsRoot, eventId) {
  const eventDirectory = path.resolve(eventsRoot, eventId)
  if (!eventDirectory.startsWith(eventsRoot) || !fs.existsSync(eventDirectory) || !fs.statSync(eventDirectory).isDirectory()) {
    return null
  }

  const photos = fs
    .readdirSync(eventDirectory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && isSupportedImageFile(entry.name) && entry.name.toLowerCase() !== 'portada.jpg')
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right, 'es'))

  return {
    IdEvento: eventId,
    title: toEventTitleFromDirectoryName(eventId),
    price: 0,
    promo: 0,
    ph: '',
    search: 'true',
    pictures: photos.map((fileName) => fileName.replace(/\.[^.]+$/, ''))
  }
}

function buildLegacyEventsIndex(eventsRoot) {
  return {
    eventos: listLegacyEventDirectories(eventsRoot).map((eventId) => ({
      ID: eventId,
      text: toEventTitleFromDirectoryName(eventId),
      url: `/eventos/?id=${encodeURIComponent(eventId)}`,
      image: `/assets/images/eventos/${encodeURIComponent(eventId)}/thumbs/portada.jpg`
    })),
    ads: []
  }
}

function legacyAssetsBridge() {
  const legacyAssetsRoot = path.resolve(__dirname, '../assets')
  const legacyEventsRoot = path.resolve(legacyAssetsRoot, 'images/eventos')

  return {
    name: 'legacy-assets-bridge',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const requestUrl = req.url || ''
        const request = new URL(requestUrl, 'http://localhost')

        if (request.pathname === '/__legacy/events-index.json') {
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(JSON.stringify(buildLegacyEventsIndex(legacyEventsRoot)))
          return
        }

        if (request.pathname === '/__legacy/event-gallery.json') {
          const eventId = String(request.searchParams.get('id') || '').trim()
          const galleryPayload = readLegacyEventGallery(legacyEventsRoot, eventId)

          if (!galleryPayload) {
            res.statusCode = 404
            res.end('Not Found')
            return
          }

          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(JSON.stringify(galleryPayload))
          return
        }

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
  plugins: [svelte(), tailwindcss(), legacyAssetsBridge()],
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
