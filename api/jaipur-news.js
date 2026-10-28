export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET')
    return response.status(405).json({ error: 'Method not allowed' })
  }
  try {
    const upstream = await fetch('https://api.livehindustan.com/feeds/rss/rajasthan/jaipur/rssfeed.xml', {
      headers: { 'User-Agent': 'Mozilla/5.0 SocialVicharNews/1.0', Accept: 'application/rss+xml, application/xml, text/xml' },
      signal: AbortSignal.timeout(15000),
    })
    if (!upstream.ok) throw new Error(`Jaipur news source responded with ${upstream.status}`)
    response.setHeader('Content-Type', 'application/rss+xml; charset=utf-8')
    response.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300')
    return response.status(200).send(await upstream.text())
  } catch {
    return response.status(502).json({ error: 'Jaipur news feed is temporarily unavailable' })
  }
}
