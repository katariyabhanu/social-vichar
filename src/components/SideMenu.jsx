<<<<<<< HEAD
import BrandLogo from './BrandLogo'
=======
import BrandLogo from './BrandLogo'
>>>>>>> 4b8d5e8cfdb105500108c4e7474e06a2cea24f80
const topics = ['होम', 'भारत', 'दुनिया', 'राजनीति', 'जयपुर', 'उत्तर प्रदेश', 'मध्य प्रदेश', 'राजस्थान', 'बिहार', 'मनोरंजन', 'बिजनेस', 'खेल', 'टेक्नोलॉजी', 'शिक्षा', 'लाइफस्टाइल']

export default function SideMenu({ onClose, onSelectTopic }) {
  return <div className="drawer-scrim" onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}><aside className="side-menu" aria-label="सभी कैटेगरी"><div className="side-menu-head"><BrandLogo variant="compact"/><button className="close-button" onClick={onClose} aria-label="बंद करें">×</button></div><p className="side-menu-label">खबरें, आपकी भाषा में</p><div className="side-menu-topics">{topics.map((topic, index) => <button key={topic} onClick={() => { onSelectTopic(topic); onClose() }}><span>{['⌂','◉','◎','▤','⌖','⌖','⌖','⌖','✦','₹','◉','⌘','▣','☼'][index]}</span>{topic}<b>›</b></button>)}</div><div className="side-menu-footer">Social Vichar · ख़बरों से जुड़े रहिए</div></aside></div>
<<<<<<< HEAD
}


=======
}


>>>>>>> 4b8d5e8cfdb105500108c4e7474e06a2cea24f80
