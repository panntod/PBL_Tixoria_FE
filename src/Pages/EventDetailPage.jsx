import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import EventCover from '../components/EventCover'
import { EventStatusBadge } from '../components/StatusBadge'
import { BlockSkeleton, ErrorState } from '../components/States'
import { formatDate, formatDateLong, formatDateShort, priceLabel, rupiah } from '../lib/format'
import { getEvent } from '../lib/services'

const TABS = [
  ['tentang', 'Tentang'],
  ['rundown', 'Rundown'],
  ['lokasi', 'Lokasi'],
]

function Rundown({ items }) {
  if (!items?.length) return <p className="muted">Rundown belum tersedia.</p>
  return (
    <ul className="rundown">
      {items.map((r) => (
        <li key={`${r.time}-${r.title}`}>
          <span className="time">{r.time}</span>
          <span>
            <b>{r.title}</b>
            {r.who && <span className="who"> · {r.who}</span>}
          </span>
        </li>
      ))}
    </ul>
  )
}

function TicketPanel({ event }) {
  const navigate = useNavigate()
  const closed = event.status === 'selesai' || event.status === 'dibatalkan'
  const isAvailable = (t) => !closed && t.seats > 0
  const firstAvailable = event.tickets.find(isAvailable)
  const [selectedId, setSelectedId] = useState(firstAvailable?.id ?? null)
  const [qty, setQty] = useState(1)

  const selected = event.tickets.find((t) => t.id === selectedId)
  const soldOut = !closed && !firstAvailable
  const maxQty = selected ? Math.min(5, selected.seats) : 1
  const total = selected ? selected.price * qty : 0

  let notice = null
  if (event.status === 'selesai') {
    notice = (
      <div className="alert alert-info">
        Acara ini telah berakhir pada {formatDateShort(event.date)}. Pendaftaran sudah ditutup.
      </div>
    )
  } else if (event.status === 'dibatalkan') {
    notice = (
      <div className="alert alert-error">
        Acara ini dibatalkan oleh penyelenggara pada {formatDateShort(event.cancelDate || event.date)}. Pendaftaran tidak
        lagi dibuka.
      </div>
    )
  } else if (soldOut) {
    notice = <div className="alert alert-warn">Semua kategori tiket telah terjual. Anda dapat menjelajahi acara lain.</div>
  }

  const ctaLabel = event.status === 'selesai' ? 'Pendaftaran ditutup' : event.status === 'dibatalkan' ? 'Acara dibatalkan' : 'Tiket habis'
  const canRegister = !closed && !soldOut

  function sub(t) {
    if (closed) return 'Tidak tersedia'
    if (t.seats === 0) return soldOut ? 'Tersisa 0 kursi' : 'Tiket habis'
    return `Tersisa ${t.seats} kursi${t.note ? ` · ${t.note}` : ''}`
  }

  function goRegister() {
    navigate(`/events/${event.id}/register?ticket=${selected.id}&qty=${qty}`)
  }

  return (
    <aside className="card ticket-panel" aria-label="Pilih tiket">
      <h2>{canRegister ? 'Pilih tiket' : 'Tiket'}</h2>
      {notice && <div style={{ marginBottom: 14 }}>{notice}</div>}

      <div role="radiogroup" aria-label="Kategori tiket">
        {event.tickets.map((t) => (
          <button
            key={t.id}
            type="button"
            role="radio"
            className="ticket-opt"
            aria-checked={selectedId === t.id}
            disabled={!isAvailable(t)}
            onClick={() => {
              setSelectedId(t.id)
              setQty(1)
            }}
          >
            <span>
              <span className="t-name">{t.name}</span>
              <span className="t-sub">{sub(t)}</span>
            </span>
            <span className="t-price">{priceLabel(t.price)}</span>
          </button>
        ))}
      </div>

      {canRegister ? (
        <>
          <div className="qty-row">
            <label htmlFor="qty">Jumlah</label>
            <select id="qty" className="select" value={qty} onChange={(e) => setQty(Number(e.target.value))}>
              {Array.from({ length: maxQty }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          <div className="total-row">
            <span>Total</span>
            <b>{rupiah(total)}</b>
          </div>
          <button type="button" className="btn btn-primary btn-block btn-lg" onClick={goRegister}>
            Daftar sekarang
          </button>
          {event.closeDate && <p className="panel-note">Pendaftaran ditutup {formatDateShort(event.closeDate)}</p>}
        </>
      ) : (
        <div className="panel-actions">
          <button type="button" className="btn btn-primary btn-block btn-lg" disabled>
            {ctaLabel}
          </button>
          <Link to="/events" className="btn btn-outline btn-block btn-lg">
            Jelajahi acara lain
          </Link>
        </div>
      )}
    </aside>
  )
}

export default function EventDetailPage() {
  const { id } = useParams()
  const [tab, setTab] = useState('tentang')
  const { data: event, isLoading, isError, refetch } = useQuery({
    queryKey: ['event', id],
    queryFn: () => getEvent(id),
  })

  const meta = useMemo(() => {
    if (!event) return []
    return [
      [event.date ? formatDate(event.date) : event.dateLabel, event.time].filter(Boolean).join(' · '),
      event.location,
      event.organizer && `Oleh ${event.organizer}`,
    ].filter(Boolean)
  }, [event])

  if (isLoading) {
    return (
      <div className="page">
        <div className="container">
          <BlockSkeleton height={300} />
        </div>
      </div>
    )
  }

  if (isError || !event) {
    return (
      <div className="page">
        <div className="container container-md">
          <ErrorState
            title="Acara tidak dapat dimuat"
            text="Acara mungkin sudah dihapus, atau koneksi Anda bermasalah."
            onRetry={refetch}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="page" style={{ paddingTop: 28 }}>
      <div className="container">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/events">Jelajahi acara</Link> / {event.category?.nama}
        </nav>

        <EventCover
          theme={event.theme}
          variant="banner"
          eyebrow={formatDateLong(event.date)}
          title={event.coverLabel}
        />

        <div className="detail-grid">
          <div className="detail-main">
            <EventStatusBadge status={event.status} />
            <h1>{event.title}</h1>
            <div className="meta-row">
              {meta.map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>

            <div className="tabs" role="tablist" aria-label="Informasi acara">
              {TABS.map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  className="tab"
                  aria-selected={tab === key}
                  onClick={() => setTab(key)}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="tab-body" role="tabpanel">
              {tab === 'tentang' && (
                <>
                  <p className="about">{event.description}</p>
                  {event.rundown?.length > 0 && (
                    <>
                      <h2>Rundown</h2>
                      <Rundown items={event.rundown} />
                    </>
                  )}
                </>
              )}
              {tab === 'rundown' && <Rundown items={event.rundown} />}
              {tab === 'lokasi' && (
                <div className="location-box">
                  <strong>{event.location}</strong>
                  <span className="muted">{event.address}</span>
                </div>
              )}
            </div>
          </div>

          <TicketPanel key={event.id} event={event} />
        </div>
      </div>
    </div>
  )
}
