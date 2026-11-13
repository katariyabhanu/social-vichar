
import { useState } from 'react'
import Navbar from './components/Navbar'
import SideMenu from './components/SideMenu'
import SignInModal from './components/SignInModal'
import NewsHome from './components/NewsHome'
import UtilityPages from './components/UtilityPages'
import './App.css'

function App() {
  const [activeTopic, setActiveTopic] = useState('होम')
  const [activeView, setActiveView] = useState('news')
  const [sideMenuOpen, setSideMenuOpen] = useState(false)
  const [signInOpen, setSignInOpen] = useState(false)
  const [query, setQuery] = useState('')

  const selectTopic = topic => {
    setActiveView('news')
    setActiveTopic(topic)
    setQuery('')
  }

  const navigateTo = view => setActiveView(view)

  return (
    <div className="social-vichar-app">
      <Navbar
        activeTopic={activeTopic}
        onSelectTopic={selectTopic}
        onNavigate={navigateTo}
        activeView={activeView}
        onOpenMenu={() => setSideMenuOpen(true)}
        onOpenSignIn={() => setSignInOpen(true)}
        query={query}
        setQuery={setQuery}
      />

      {activeView === 'news' ? (
        <NewsHome
          activeTopic={activeTopic}
          query={query}
          onSelectTopic={selectTopic}
        />
      ) : <UtilityPages view={activeView} />}

      {sideMenuOpen && (
        <SideMenu
          onClose={() => setSideMenuOpen(false)}
          onSelectTopic={selectTopic}
        />
      )}

      {signInOpen && (
        <SignInModal onClose={() => setSignInOpen(false)} />
      )}
    </div>
  )
}

export default App
