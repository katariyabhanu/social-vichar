async function fetchFeed(endpoint, signal, sourceName) {
  const response = await fetch(endpoint, { signal, headers: { Accept: 'application/rss+xml, application/xml, text/xml' } })
  if (!response.ok) throw new Error(`${sourceName} request failed (${response.status})`)
  const xml = new DOMParser().parseFromString(await response.text(), 'application/xml')
  if (xml.querySelector('parsererror')) throw new Error(`${sourceName} feed could not be read`)

  return [...xml.querySelectorAll('channel > item')].map((item, index) => {
    const title = item.querySelector('title')?.textContent?.trim() || ''
    const summary = item.querySelector('description')?.textContent?.trim() || ''
    const url = item.querySelector('link')?.textContent?.trim() || ''
    const published = item.querySelector('pubDate')?.textContent?.trim() || item.querySelector('pubdate')?.textContent?.trim() || ''
    const path = new URL(url || 'https://www.aajtak.in').pathname.toLowerCase()
    const category = /sports|cricket|football/.test(path) ? 'खेल'
      : /business|market|economy/.test(path) ? 'बिजनेस'
      : /entertainment|cinema|television|movie/.test(path) ? 'मनोरंजन'
      : /technology|tech-gadget/.test(path) ? 'टेक्नोलॉजी'
      : /world|international/.test(path) ? 'दुनिया'
      : /election|politic/.test(path) ? 'राजनीति'
      : /uttar-pradesh|madhya-pradesh|rajasthan|bihar|delhi|maharashtra/.test(path) ? 'राज्य'
      : sourceName === 'जयपुर' ? 'जयपुर' : 'देश'
    const date = new Date(published)
    const time = Number.isNaN(date.getTime()) ? 'ताज़ा अपडेट' : new Intl.DateTimeFormat('hi-IN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' }).format(date) + ' बजे'
    const visual = category === 'खेल' ? 'visual-sport' : category === 'बिजनेस' ? 'visual-market' : category === 'मनोरंजन' ? 'visual-cinema' : category === 'टेक्नोलॉजी' ? 'visual-tech' : category === 'दुनिया' ? 'visual-world' : 'visual-parliament'
    return { id: item.querySelector('guid')?.textContent?.trim() || url || `${sourceName}-${index}`, title, summary, url, category, time, published, visual, badge: index === 0 ? 'ताज़ा खबर' : '', source: sourceName }
  }).filter(story => story.title && story.url).sort((a, b) => new Date(b.published) - new Date(a.published))
}

export const fetchAajTakFeed = ({ signal } = {}) => fetchFeed('/api/aajtak-news', signal, 'Aaj Tak')
export const fetchJaipurFeed = ({ signal } = {}) => fetchFeed('/api/jaipur-news', signal, 'जयपुर')
