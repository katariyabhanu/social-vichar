const allowedHosts = new Set([
  'aajtak.in',
  'www.aajtak.in',
  'livehindustan.com',
  'www.livehindustan.com',
])

export async function resolveArticleImage(articleUrl) {
  let article
  try {
    article = new URL(articleUrl)
  } catch {
    return ''
  }
  if (article.protocol !== 'https:' || !allowedHosts.has(article.hostname)) return ''

  const page = await fetch(article, {
    headers: { 'User-Agent': 'Mozilla/5.0 SocialVicharNews/1.0', Accept: 'text/html' },
    signal: AbortSignal.timeout(8000),
  })
  if (!page.ok || !allowedHosts.has(new URL(page.url).hostname)) return ''

  const html = await page.text()
  const tags = html.match(/<(?:meta|img|source)\b[^>]*>/gi) || []
  const candidates = []
  for (const tag of tags) {
    const isSocialImage = /(?:property|name)=["'](?:og:image|twitter:image)["']/i.test(tag)
    const attributes = tag.matchAll(/(?:content|src|data-src|data-original|srcset|data-srcset)=["']([^"']+)["']/gi)
    for (const attribute of attributes) {
      const rawUrl = attribute[1].split(',')[0].trim().split(/\s+/)[0]
      try {
        const image = new URL(rawUrl.replaceAll('&amp;', '&'), page.url)
        if (image.protocol !== 'https:') continue
        const path = image.pathname.toLowerCase()
        if (/logo|icon|author|profile|pre-loader|breaking-news|placeholder/.test(path)) continue
        const score = /\/images\/(story|photo_gallery)\/|\/lh-img\/smart\/img\//.test(path) ? 10 : isSocialImage ? 1 : 0
        candidates.push({ url: image.href, score })
      } catch {
        // Skip malformed image URLs.
      }
    }
  }
  candidates.sort((a, b) => b.score - a.score)
  return candidates[0]?.url || ''
}

async function resolveRelatedImage(title, category) {
  const categorySearch = {
    'जयपुर': 'Jaipur Rajasthan India',
    'खेल': 'cricket sports India',
    'बिजनेस': 'business India',
    'मनोरंजन': 'Bollywood India',
    'टेक्नोलॉजी': 'technology India',
    'दुनिया': 'world news',
    'राजनीति': 'India parliament politics',
    'राज्य': 'Rajasthan India',
    'देश': 'India news',
    'धर्म': 'Indian festival',
  }
  const searches = [title, categorySearch[category]].filter(Boolean)
  for (const terms of searches) {
    const endpoint = new URL('https://commons.wikimedia.org/w/api.php')
    endpoint.search = new URLSearchParams({
      action: 'query',
      generator: 'search',
      gsrsearch: terms.slice(0, 180),
      gsrnamespace: '6',
      gsrlimit: '5',
      prop: 'imageinfo',
      iiprop: 'url',
      iiurlwidth: '960',
      format: 'json',
    }).toString()
    const response = await fetch(endpoint, {
      headers: { 'User-Agent': 'SocialVicharNews/1.0 (related news thumbnails)' },
      signal: AbortSignal.timeout(6000),
    })
    if (!response.ok) continue
    const data = await response.json()
    const pages = Object.values(data.query?.pages || {}).sort((a, b) => a.index - b.index)
    const image = pages.find(page => page.imageinfo?.[0]?.thumburl)?.imageinfo?.[0]?.thumburl
    if (image) return image
  }
  return ''
}

export async function resolveNewsImage(articleUrl, title, category) {
  try {
    const publisherImage = await resolveArticleImage(articleUrl)
    if (publisherImage) return publisherImage
  } catch {
    // Use a headline-matched public image if the publisher page has none.
  }
  try {
    return await resolveRelatedImage(title, category)
  } catch {
    return ''
  }
}

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET')
    return response.status(405).end()
  }
  try {
    const image = await resolveNewsImage(request.query?.url, request.query?.title, request.query?.category)
    if (!image) return response.status(404).end()
    response.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600')
    response.setHeader('Location', image)
    return response.status(302).end()
  } catch {
    return response.status(502).end()
  }
}
