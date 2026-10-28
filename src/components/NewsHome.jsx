import { useEffect, useMemo, useState } from 'react'
import BrandLogo from './BrandLogo'
import { fetchAajTakFeed, fetchJaipurFeed } from '../api/news'
const tickerItems = ['आज की बड़ी खबर', 'देश-दुनिया के लाइव अपडेट', 'आपके शहर की हर हलचल', 'खबर वही, नज़रिया नया']
const generalTopics = ['होम', 'Social Vichar', 'India Today', 'जयपुर', 'Jaipur', 'हिंदी', 'मराठी', 'माइक्रोब्लॉग', 'ई-पेपर', 'ताज़ा खबरें', 'लाइव', 'मौसम', 'पॉडकास्ट']

export default function NewsHome({ activeTopic, query, onSelectTopic }) {
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [feedError, setFeedError] = useState('')
  const [lastUpdated, setLastUpdated] = useState(null)

  const isJaipur = activeTopic === 'जयपुर' || activeTopic.toLowerCase() === 'jaipur'
  useEffect(() => {
    const controller = new AbortController()
    let mounted = true
    const loadNews = async (initial = false) => {
      if (initial && mounted) setLoading(true)
      try {
        const feed = isJaipur ? await fetchJaipurFeed({ signal: controller.signal }) : await fetchAajTakFeed({ signal: controller.signal })
        if (!mounted) return
        const todayKey = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())
        const latest = isJaipur ? feed.filter(story => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(story.published)) === todayKey) : feed
        setStories(latest)
        setFeedError(latest.length ? '' : isJaipur ? 'Aaj Jaipur ki koi nayi khabar feed mein nahi mili.' : 'Feed mein abhi koi khabar available nahi hai.')
        setLastUpdated(new Date())
      } catch (error) {
        if (!mounted || error.name === 'AbortError') return
        setFeedError(`${isJaipur ? 'Jaipur' : 'Aaj Tak'} news feed abhi load nahi ho pa rahi. Thodi der baad dobara try karein.`)
      } finally {
        if (mounted && initial) setLoading(false)
      }
    }
    loadNews(true)
    const timer = window.setInterval(() => loadNews(false), 5 * 60 * 1000)
    return () => { mounted = false; controller.abort(); window.clearInterval(timer) }
  }, [isJaipur])
  const visibleStories = useMemo(() => {
    const term = query.trim().toLocaleLowerCase('hi-IN')
    const topic = activeTopic.toLocaleLowerCase('hi-IN')
    const topicRoutes = { 'उत्तर प्रदेश': 'uttar-pradesh', 'मध्य प्रदेश': 'madhya-pradesh', 'राजस्थान': 'rajasthan', 'बिहार': 'bihar', 'भारत': 'india' }
    return stories.filter(story => {
      const matchesQuery = !term || `${story.title} ${story.category} ${story.summary}`.toLocaleLowerCase('hi-IN').includes(term)
      const matchesTopic = generalTopics.some(value => value.toLocaleLowerCase('hi-IN') === topic) || !topic || (topic === 'भारत' && ['देश', 'राज्य', 'राजनीति'].includes(story.category)) || story.category.toLocaleLowerCase('hi-IN').includes(topic) || story.title.toLocaleLowerCase('hi-IN').includes(topic) || Boolean(topicRoutes[activeTopic] && story.url.includes(topicRoutes[activeTopic]))
      return matchesQuery && matchesTopic
    })
  }, [stories, activeTopic, query])
  const leadStory = visibleStories[0]
  const lastUpdatedText = lastUpdated ? new Intl.DateTimeFormat('hi-IN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' }).format(lastUpdated) : ''
  const storyVisual = story => <div className={`story-visual ${story.visual}`} aria-hidden="true"><span className="visual-orb"/><span className="visual-sun"/><span className="visual-city">{story.category}</span><span className="lead-photo-caption">AAJ TAK <b>LIVE</b></span></div>

  return <main id="news-home" className="news-home">
    <div className="breaking-strip"><span className="breaking-label"><i/> ताज़ा खबर</span><p>{leadStory?.title || 'देश और दुनिया की हर बड़ी खबर, सबसे पहले Social Vichar पर'}</p><button onClick={() => onSelectTopic('ताज़ा खबरें')}>सभी अपडेट <b>›</b></button></div>
    <div className="ticker-row"><span>ट्रेंडिंग</span>{tickerItems.map((item,index)=><button key={item} onClick={() => onSelectTopic(index === 1 ? 'दुनिया' : index === 2 ? 'राज्य' : 'होम')}>{item}<b>↗</b></button>)}</div>
    <section className="news-section"><div className="section-title"><div><span className="section-kicker">SOCIAL VICHAR · {activeTopic === 'होम' ? 'आज की सुर्खियां' : activeTopic}</span><h1>{query.trim() ? `“${query}” की खबरें` : activeTopic === 'होम' ? 'आज की बड़ी खबरें' : `${activeTopic} की खबरें`}</h1></div><div className="feed-status"><span className="source-label">SOURCE · {isJaipur ? 'JAIPUR RSS' : 'AAJ TAK'}</span><span>{lastUpdatedText ? `अपडेट ${lastUpdatedText}` : ''}</span><button className="latest-button" onClick={() => window.location.reload()}>रिफ्रेश <span>↻</span></button></div></div>
      {loading && <div className="feed-message"><span className="loading-dot"/> {isJaipur ? 'Jaipur feed' : 'Aaj Tak'} से आज की खबरें लाई जा रही हैं...</div>}
      {!loading && feedError && <div className="feed-message feed-error"><span>!</span><p>{feedError}</p><button onClick={() => window.location.reload()}>फिर कोशिश करें</button></div>}
      {!loading && !feedError && visibleStories.length === 0 && <div className="feed-message">इस विषय पर कोई खबर नहीं मिली। दूसरा विषय खोजें।</div>}
      {!loading && leadStory && <><div className="news-layout"><a className="lead-story" href={leadStory.url} target="_blank" rel="noreferrer"><div className={`story-visual lead-visual ${leadStory.visual}`}><span className="visual-orb"/><span className="visual-sun"/><span className="visual-city">{leadStory.category}</span><span className="lead-photo-caption">AAJ TAK <b>LIVE</b></span></div><div className="lead-copy"><span className="story-category"><i/>{leadStory.badge || leadStory.category}</span><h2>{leadStory.title}</h2><p>{leadStory.summary}</p><span className="story-time">{leadStory.time} <b>·</b> <span className="source-label">{leadStory.source} पर पढ़ें ↗</span></span></div></a>
        <aside className="headline-rail"><div className="rail-heading"><h2>अभी चर्चा में</h2><span>LIVE</span></div>{visibleStories.slice(1,5).map((story,index)=><a className="rail-story" key={story.id} href={story.url} target="_blank" rel="noreferrer"><span className={`rail-thumb ${story.visual}`}><b>0{index+1}</b></span><span><small>{story.category} <i>·</i> {story.time}</small><strong>{story.title}</strong></span></a>)}</aside>
      </div>
      <div className="more-news-head"><div><span className="section-kicker">हर पल अपडेट</span><h2>और खबरें</h2></div><span>ताज़ा · भरोसेमंद · {isJaipur ? 'Jaipur city feed' : 'Aaj Tak feed'}</span></div>
      <div className="story-grid">{visibleStories.slice(1,13).map(story=><a className="story-card" key={story.id} href={story.url} target="_blank" rel="noreferrer">{storyVisual(story)}<div className="story-card-copy"><span className="story-category"><i/>{story.category}</span><h3>{story.title}</h3><p>{story.summary}</p><span className="story-time">{story.time}</span></div></a>)}</div>
      </>}
      <div className="feed-attribution">खबरों का स्रोत: <a href={isJaipur ? 'https://www.livehindustan.com/rss' : 'https://www.aajtak.in/rssfeeds?id=home'} target="_blank" rel="noreferrer">{isJaipur ? 'Jaipur RSS' : 'Aaj Tak RSS'}</a>. यह सूची लगभग हर 5 मिनट में अपडेट होती है.</div>
    </section>
    <footer className="site-footer"><div className="footer-brand"><BrandLogo variant="footer"/><p>खबर वही, नज़रिया नया।</p></div><span>© {new Date().getFullYear()} Social Vichar · सभी अधिकार सुरक्षित</span><div>{['भारत','दुनिया','बिजनेस','खेल'].map(item=><button key={item} onClick={() => onSelectTopic(item)}>{item}</button>)}</div></footer>
  </main>
<<<<<<< HEAD
}





=======
}





>>>>>>> 4b8d5e8cfdb105500108c4e7474e06a2cea24f80
