import { useState } from 'react'

const externalPages = {
  epaper: {
    kicker: 'AAJ TAK E-PAPER',
    title: 'आज का ई-पेपर पढ़ें',
    description: 'Aaj Tak का आधिकारिक डिजिटल अख़बार नए टैब में खोलें।',
    url: 'https://epaper.aajtak.in/page1',
    action: 'ई-पेपर खोलें',
    icon: '▤',
  },
  weather: {
    kicker: 'AAJ TAK WEATHER',
    title: 'आज का मौसम',
    description: 'शहर का मौसम, पूर्वानुमान और वायु गुणवत्ता देखें।',
    url: 'https://www.aajtak.in/weather',
    action: 'मौसम देखें',
    icon: '☀',
  },
  podcasts: {
    kicker: 'AAJ TAK PODCASTS',
    title: 'सुनिए खबरें और पॉडकास्ट',
    description: 'ख़बर और पॉलिटिक्स, खेल, सेहत, टेक्नोलॉजी और दूसरी सीरीज़ सुनें।',
    url: 'https://podcasts.aajtak.in/',
    action: 'पॉडकास्ट सुनें',
    icon: '◉',
  },
  live: {
    kicker: 'AAJ TAK LIVE',
    title: 'लाइव खबरें देखें',
    description: 'Aaj Tak का आधिकारिक लाइव न्यूज़ चैनल खोलें।',
    url: 'https://www.aajtak.in/livetv',
    action: 'लाइव टीवी देखें',
    icon: '▶',
  },
}

function readPosts() {
  try {
    const saved = JSON.parse(localStorage.getItem('social-vichar-microblogs') || '[]')
    return Array.isArray(saved) ? saved : []
  } catch {
    return []
  }
}

function MicroblogPage() {
  const [posts, setPosts] = useState(readPosts)
  const [text, setText] = useState('')

  const publish = event => {
    event.preventDefault()
    const content = text.trim()
    if (!content) return
    const next = [{ id: `${Date.now()}`, content, createdAt: new Date().toISOString() }, ...posts]
    setPosts(next)
    localStorage.setItem('social-vichar-microblogs', JSON.stringify(next))
    setText('')
  }

  return <main className="utility-page microblog-page">
    <span className="section-kicker">SOCIAL VICHAR · माइक्रोब्लॉग</span>
    <h1>छोटी बात, बड़ा विचार</h1>
    <p className="utility-intro">खबरों पर अपनी राय लिखें और अपने विचारों की सूची बनाएं।</p>
    <form className="microblog-composer" onSubmit={publish}>
      <label htmlFor="microblog-text">आप क्या सोच रहे हैं?</label>
      <textarea id="microblog-text" value={text} maxLength={280} onChange={event => setText(event.target.value)} placeholder="अपना विचार लिखें…" />
      <div><small>{text.length}/280</small><button className="utility-action" type="submit" disabled={!text.trim()}>पोस्ट करें</button></div>
    </form>
    <p className="local-note">ये पोस्ट इसी डिवाइस पर सेव होती हैं।</p>
    <div className="microblog-list">{posts.length ? posts.map(post => <article className="microblog-post" key={post.id}><p>{post.content}</p><time>{new Intl.DateTimeFormat('hi-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(post.createdAt))}</time></article>) : <div className="utility-empty">अभी कोई पोस्ट नहीं है। अपना पहला विचार लिखें।</div>}</div>
  </main>
}

export default function UtilityPages({ view }) {
  if (view === 'microblog') return <MicroblogPage />
  const page = externalPages[view]
  if (!page) return null
  return <main className="utility-page service-page">
    <span className="section-kicker">{page.kicker}</span>
    <div className="service-card">
      <span className="service-icon" aria-hidden="true">{page.icon}</span>
      <h1>{page.title}</h1>
      <p>{page.description}</p>
      <a className="utility-action" href={page.url} target="_blank" rel="noreferrer">{page.action} <span aria-hidden="true">↗</span></a>
    </div>
  </main>
}
