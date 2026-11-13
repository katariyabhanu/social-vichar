export default function BrandLogo({ variant = '' }) {
  return (
    <span className={`sv-brand ${variant ? `sv-brand--${variant}` : ''}`}>
      <img
        className="sv-logo-image"
        src="/social-vichar-logo.png"
        alt="Social Vichar"
      />
    </span>
  )
}
