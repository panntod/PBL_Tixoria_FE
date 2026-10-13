export function EmptyState({ icon = '0', title, text, action }) {
  return (
    <div className="card state-card">
      <div className="status-icon">{icon}</div>
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {action}
    </div>
  )
}

export function ErrorState({ title = 'Gagal memuat', text = 'Periksa koneksi internet Anda lalu coba lagi.', onRetry }) {
  return (
    <div className="card state-card">
      <div className="status-icon err">!</div>
      <h3>{title}</h3>
      <p>{text}</p>
      {onRetry && (
        <button type="button" className="btn btn-outline" onClick={onRetry}>
          Coba lagi
        </button>
      )}
    </div>
  )
}

export function EventGridSkeleton({ count = 4 }) {
  return (
    <div className="event-grid" aria-busy="true" aria-label="Memuat acara">
      {Array.from({ length: count }).map((_, i) => (
        <div className="skel-card" key={i}>
          <div className="skeleton" style={{ aspectRatio: 1.62 }} />
          <div className="skel-lines">
            <div className="skeleton" style={{ height: 14, width: '80%' }} />
            <div className="skeleton" style={{ height: 14, width: '55%' }} />
          </div>
        </div>
      ))}
    </div>
  )
}

export function BlockSkeleton({ height = 240 }) {
  return <div className="skeleton" style={{ height }} aria-busy="true" />
}
