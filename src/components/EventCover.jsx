// Sampul acara bergaya desain baru: 4 tema (indigo, mint, amber, dark).
export default function EventCover({ theme = 'indigo', eyebrow, title, variant = 'card', className = '' }) {
  return (
    <div className={`cover t-${theme} cover-${variant} ${className}`}>
      <div className="cover-text">
        {eyebrow && <div className="cover-eyebrow">{eyebrow}</div>}
        <div className="cover-title">{title}</div>
      </div>
    </div>
  )
}
