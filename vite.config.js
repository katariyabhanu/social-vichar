
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const feedSources = {
  '/api/aajtak-news': 'https://www.aajtak.in/rssfeeds?id=home',
  '/api/jaipur-news':
    'https://api.livehindustan.com/feeds/rss/rajasthan/jaipur/rssfeed.xml',
}

const newsFeedMiddleware = async (request, response, next) => {
  const path = request.url?.split('?')[0]
  const feedUrl = feedSources[path]

  if (!feedUrl) return next()

  if (request.method !== 'GET') {
    response.statusCode = 405
    response.end('Method not allowed')
    return
  }

  try {
    const upstream = await fetch(feedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 SocialVicharNews/1.0',
        Accept: 'application/rss+xml, application/xml, text/xml',
      },
      signal: AbortSignal.timeout(15000),
    })

    if (!upstream.ok) {
      throw new Error(`News source responded with ${upstream.status}`)
    }

    response.statusCode = 200
    response.setHeader(
      'Content-Type',
      'application/rss+xml; charset=utf-8',
    )
    response.setHeader('Cache-Control', 'public, max-age=60, s-maxage=60')
    response.end(await upstream.text())
  } catch (error) {
    response.statusCode = 502
    response.setHeader('Content-Type', 'application/json; charset=utf-8')
    response.end(
      JSON.stringify({
        error: 'News feed is temporarily unavailable',
        detail: error.message,
      }),
    )
  }
}

const newsFeedProxy = {
  name: 'social-vichar-news-feeds',
  configureServer(server) {
    server.middlewares.use(newsFeedMiddleware)
  },
  configurePreviewServer(server) {
    server.middlewares.use(newsFeedMiddleware)
  },
}

export default defineConfig({
  plugins: [react(), newsFeedProxy],
})
