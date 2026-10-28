import BrandLogo from './BrandLogo'
import { useState } from 'react'

export default function SignInModal({ onClose }) {
  const [complete, setComplete] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  return <div className="modal-scrim" onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}><section className="signin-modal" aria-label="Social Vichar sign in"><button className="close-button" onClick={onClose} aria-label="बंद करें">×</button>{complete ? <div className="signin-success"><span>✓</span><h2>आप Social Vichar से जुड़ गए हैं</h2><p>अब आप अपनी पसंद की खबरें पढ़ सकते हैं।</p><button className="signin-submit" onClick={onClose}>जारी रखें</button></div> : <><BrandLogo variant="signin"/><p className="signin-eyebrow">आपकी खबरें, आपकी पसंद</p><h2>Sign in करें</h2><p className="signin-intro">ताज़ा खबरों और अपने पसंदीदा विषयों से जुड़े रहें।</p><form onSubmit={event => { event.preventDefault(); setComplete(true) }}><label>ईमेल या मोबाइल नंबर<input required autoComplete="username" placeholder="name@example.com" /></label><label>पासवर्ड<span className="password-input"><input required type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="अपना पासवर्ड डालें"/><button type="button" onClick={() => setShowPassword(show => !show)}>{showPassword ? 'छुपाएँ' : 'दिखाएँ'}</button></span></label><button className="signin-submit" type="submit">Sign In</button></form><p className="signin-note">यह केवल frontend demo है।</p></>}</section></div>
}

