export default function BrandLogo({ variant = '' }) {
  const navBadge = variant === 'nav'
  return <span className={`sv-brand ${variant ? `sv-brand--${variant}` : ''}`} aria-label="Social Vichar">
    <span className="sv-brand-mark" aria-hidden="true">{navBadge ? <svg className="sv-nav-badge" viewBox="0 0 180 112"><path className="badge-shadow" d="M31 5 151 17 178 102 13 106Z" /><path className="badge-face" d="M34 9 148 21 170 96 20 101Z" /><path className="badge-inner" d="M38 14 144 25 163 91 27 96Z" /><text className="badge-word badge-social" x="94" y="49" textAnchor="middle">SOCIAL</text><text className="badge-word badge-vichar" x="94" y="79" textAnchor="middle">VICHAR</text><path className="badge-accent" d="m42 87 103 0" /></svg> : <svg viewBox="0 0 64 64"><defs><linearGradient id="svShield" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ff3543" /><stop offset=".56" stopColor="#e30b22" /><stop offset="1" stopColor="#af001b" /></linearGradient></defs><path className="sv-shield" d="M8 8 56 3 53 44 32 61 9 48Z" /><path className="sv-shield-line" d="m13 12 38-4-2 33-17 14-19-11Z" /><text className="sv-monogram" x="32" y="39" textAnchor="middle">SV</text><path className="sv-monogram-accent" d="m38 46 9-7" /></svg>}</span>
    {!navBadge && <span className="sv-brand-type"><strong>SOCIAL</strong><b>VICHAR</b><small>NEWS · VIEWS · VOICES</small></span>}
  </span>
}
