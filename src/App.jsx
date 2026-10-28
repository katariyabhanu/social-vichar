import { useState } from 'react'
import Navbar from './components/Navbar'
import SideMenu from './components/SideMenu'
import SignInModal from './components/SignInModal'
import NewsHome from './components/NewsHome'
import './App.css'

function App() {
  const [activeTopic, setActiveTopic] = useState('होम')
  const [sideMenuOpen, setSideMenuOpen] = useState(false)
  const [signInOpen, setSignInOpen] = useState(false)
  const [query, setQuery] = useState('')
  const selectTopic = topic => {
    setActiveTopic(topic)
    setQuery('')
  }
  return <div className="social-vichar-app">
    <Navbar activeTopic={activeTopic} onSelectTopic={selectTopic} onOpenMenu={() => setSideMenuOpen(true)} onOpenSignIn={() => setSignInOpen(true)} query={query} setQuery={setQuery}/>
    <NewsHome activeTopic={activeTopic} query={query} onSelectTopic={selectTopic}/>
    {sideMenuOpen && <SideMenu onClose={() => setSideMenuOpen(false)} onSelectTopic={selectTopic}/>}
    {signInOpen && <SignInModal onClose={() => setSignInOpen(false)}/>}
  </div>
}

export default App
