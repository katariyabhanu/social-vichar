
import BrandLogo from './BrandLogo'
import { useState } from 'react'

const channels = [
  'भारत',
  'दुनिया',
  'राजनीति',
  'राजस्थान',
  'जयपुर',
  'उत्तर प्रदेश',
  'बिहार',
  'बिजनेस',
  'मनोरंजन',
  'खेल',
  'टेक्नोलॉजी',
  'शिक्षा',
  'लाइफस्टाइल',
  'धर्म',
]

const navItems = ['होम', 'माइक्रोब्लॉग', 'ई-पेपर', 'भारत']

export default function Navbar({
  activeTopic,
  onSelectTopic,
  onOpenMenu,
  onOpenSignIn,
  onNavigate,
  activeView,
  query,
  setQuery,
}) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [indiaOpen, setIndiaOpen] = useState(false)
  const [channelMenuOpen, setChannelMenuOpen] = useState(false)
  const [editionOpen, setEditionOpen] = useState(false)
  const [edition, setEdition] = useState('भारत')

  const time = new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Kolkata',
  }).format(new Date())

  const date = new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  }).format(new Date())

  const choose = topic => {
    onNavigate('news')
    onSelectTopic(topic)
    setIndiaOpen(false)
    setChannelMenuOpen(false)
    setEditionOpen(false)

    document
      .getElementById('news-home')
      ?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <div className="channel-strip">
        <div className="date-stamp">
          {date} <span>|</span> {time} IST
        </div>

        <div className="channel-links">
          {channels.slice(0, 10).map(channel => (
            <button
              key={channel}
              className={activeView === 'news' && activeTopic === channel ? 'channel-active' : ''}
              onClick={() => choose(channel)}
            >
              {channel}
            </button>
          ))}

          <button
            className="channel-more"
            aria-label="More channels"
            aria-expanded={channelMenuOpen}
            onClick={() => setChannelMenuOpen(open => !open)}
          >
            ⌄
          </button>
        </div>

        <button className="sign-in-top" onClick={onOpenSignIn}>
          Sign In <span className="user-outline">♙</span>
        </button>

        {channelMenuOpen && (
          <div className="channel-dropdown">
            {channels
              .slice(10)
              .map(channel => (
                <button key={channel} onClick={() => choose(channel)}>
                  {channel}
                </button>
              ))}
          </div>
        )}
      </div>

      <div className="header-gap" />

      <header className="main-header">
        <div className="main-nav">
          <button
            className="hamburger"
            aria-label="Open navigation menu"
            onClick={onOpenMenu}
          >
            <span />
            <span />
            <span />
          </button>

          <button
            className="brand-lockup"
            onClick={() => choose('होम')}
            aria-label="Social Vichar home"
          >
            <BrandLogo variant="nav" />
          </button>

          <nav className="primary-links" aria-label="Main navigation">
            {navItems.map(item =>
              item === 'भारत' ? (
                <div className="nav-dropdown-wrap" key={item}>
                  <button
                    className={activeTopic === item && activeView === 'news' ? 'nav-active' : ''}
                    aria-expanded={indiaOpen}
                    onClick={() => setIndiaOpen(open => !open)}
                  >
                    {item}
                    <span className="down-caret">⌄</span>
                  </button>

                  {indiaOpen && (
                    <div className="india-dropdown">
                      {[
                        'भारत',
                        'दुनिया',
                        'राजनीति',
                        'उत्तर प्रदेश',
                        'मध्य प्रदेश',
                        'राजस्थान',
                        'बिहार',
                      ].map(link => (
                        <button key={link} onClick={() => choose(link)}>
                          {link}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  key={item}
                  className={activeView === (item === 'होम' ? 'news' : item === 'माइक्रोब्लॉग' ? 'microblog' : 'epaper') ? 'nav-active' : ''}
                  onClick={() => item === 'होम' ? choose('होम') : onNavigate(item === 'माइक्रोब्लॉग' ? 'microblog' : 'epaper')}
                >
                  {item}
                </button>
              ),
            )}
          </nav>

          <div className="nav-tools">
            <span className="edition-label">EDITION</span>

            <button
              className="edition-select"
              aria-expanded={editionOpen}
              onClick={() => setEditionOpen(open => !open)}
            >
              <span>🇮🇳</span> {edition === 'जयपुर' ? 'JAI' : 'IN'} <b>⌄</b>
            </button>
            {editionOpen && <div className="edition-dropdown">{['भारत', 'जयपुर'].map(value => <button key={value} onClick={() => { setEdition(value); choose(value === 'भारत' ? 'होम' : 'जयपुर') }}>{value}</button>)}</div>}

            <button
              className="tool-button"
              onClick={() => onNavigate('epaper')}
            >
              <span className="tool-icon paper-icon">▤</span>
              <small>E-PAPER</small>
            </button>

            <button className="tool-button" onClick={() => onNavigate('weather')}>
              <span className="tool-icon">☀</span>
              <small>मौसम</small>
            </button>

            <button
              className="tool-button radio-tool"
              onClick={() => onNavigate('podcasts')}
            >
              <span className="tool-icon">◉</span>
              <small>RADIO</small>
            </button>

            <button
              className="tool-button notification-tool"
              onClick={() => choose('ताज़ा खबरें')}
              aria-label="Notifications"
            >
              <span className="tool-icon">♧</span>
              <b>20</b>
              <small>अपडेट</small>
            </button>

            <button className="live-button" onClick={() => onNavigate('live')}>
              <span />
              LIVE
            </button>

            <button
              className="search-toggle"
              aria-label="Search"
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen(open => !open)}
            >
              <span />
            </button>
          </div>
        </div>

        {searchOpen && (
          <form
            className="search-panel"
            onSubmit={event => {
              event.preventDefault()
              choose(query || 'होम')
            }}
          >
            <span className="search-panel-icon" />

            <input
              autoFocus
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="खबरें खोजें..."
            />

            <button type="submit">खोजें</button>

            <button
              className="search-close"
              type="button"
              onClick={() => {
                setSearchOpen(false)
                setQuery('')
              }}
            >
              ×
            </button>
          </form>
        )}
      </header>
    </>
  )
}
