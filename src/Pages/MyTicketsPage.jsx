import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import EventCover from '../components/EventCover'
import { RegistrationStatusBadge } from '../components/StatusBadge'
import { EmptyState, ErrorState, BlockSkeleton } from '../components/States'
import { formatDate } from '../lib/format'
import { groupOf, listRegistrations } from '../lib/services'

const TABS = [
  ['akan-datang', 'Akan datang'],
  ['selesai', 'Selesai'],
  ['dibatalkan', 'Dibatalkan'],
]

function TicketRow({ reg }) {
  const ev = reg.event
  const active = reg.status === 'sah'
  const sub =
    reg.status === 'dibatalkan'
      ? `Dibatalkan oleh penyelenggara · ${reg.orderNo}`
      : `${ev ? formatDate(ev.date) : ''} · ${reg.orderNo}`
  return (
    <div className="card ticket-row">
      {ev && <EventCover theme={ev.theme} variant="thumb" eyebrow={ev.category?.nama} title={ev.coverLabel.split('\n')[0]} />}
      <div className="info">
        <RegistrationStatusBadge status={reg.status} />
        <h3>{ev?.title ?? 'Acara tidak tersedia'}</h3>
        <p className="meta">{sub}</p>
      </div>
      <Link to={`/tickets/${reg.orderNo}`} className={active ? 'btn btn-primary btn-sm' : 'btn btn-ghost btn-sm'}>
        {active ? 'Lihat tiket' : 'Detail'}
      </Link>
    </div>
  )
}

export default function MyTicketsPage() {
  // Pendaftaran yang belum dibayar belum menjadi tiket, jadi tidak ditampilkan di sini.
  const { data = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['registrations'],
    queryFn: listRegistrations,
    select: (list) => list.filter((r) => r.status !== 'menunggu'),
  })
  const [tab, setTab] = useState('akan-datang')

  const counts = Object.fromEntries(TABS.map(([key]) => [key, data.filter((r) => groupOf(r) === key).length]))
  const visible = data.filter((r) => groupOf(r) === tab)

  return (
    <div className="page">
      <div className="container">
        <div className="list-narrow">
          <h1 className="page-title" style={{ marginBottom: 18 }}>
            Tiket saya
          </h1>

          <div className="tabs" role="tablist" aria-label="Status tiket" style={{ marginBottom: 24 }}>
            {TABS.map(([key, label]) => (
              <button key={key} type="button" role="tab" className="tab" aria-selected={tab === key} onClick={() => setTab(key)}>
                {label} ({counts[key] ?? 0})
              </button>
            ))}
          </div>

          {isLoading && <BlockSkeleton height={120} />}
          {isError && <ErrorState title="Gagal memuat tiket" onRetry={refetch} />}
          {!isLoading && !isError && data.length === 0 && (
            <EmptyState
              title="Belum ada tiket"
              text="Tiket dari acara yang Anda daftar akan muncul di sini."
              action={
                <Link to="/events" className="btn btn-primary">
                  Jelajahi acara
                </Link>
              }
            />
          )}
          {!isLoading && !isError && data.length > 0 && visible.length === 0 && (
            <EmptyState title="Tidak ada tiket di sini" text="Belum ada tiket dengan status ini." />
          )}
          {visible.map((r) => (
            <TicketRow key={r.orderNo} reg={r} />
          ))}
        </div>
      </div>
    </div>
  )
}
