import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight } from 'lucide-react'
import { api } from '../lib/api'
import { getCategoryIcon } from '../lib/categoryIcons'
import EventCard from '../components/EventCard'

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeCategory = searchParams.get('category') || 'semua'
  const searchTerm = searchParams.get('q') || ''

  function selectCategory(slug) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (slug === 'semua') next.delete('category')
      else next.set('category', slug)
      return next
    })
  }

  const { data: stats } = useQuery({
    queryKey: ['events', 'stats'],
    queryFn: api.getEventStats,
  })
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: api.getCategories,
  })
  const { data: nearbyEvents = [] } = useQuery({
    queryKey: ['events', 'nearby'],
    queryFn: api.getNearbyEvents,
  })
  const { data: trendingEvents = [] } = useQuery({
    queryKey: ['events', 'trending'],
    queryFn: api.getTrendingEvents,
  })
  const { data: endedEvents = [] } = useQuery({
    queryKey: ['events', 'ended'],
    queryFn: api.getEndedEvents,
  })
  const {
    data: events = [],
    isLoading: eventsLoading,
    isError: eventsError,
  } = useQuery({
    queryKey: ['events', 'list', activeCategory, searchTerm],
    queryFn: () => api.getEvents({ category: activeCategory, search: searchTerm }),
  })

  // Urutan tampil podium: rank-2, rank-1, rank-3 (sesuai desain asli)
  const podiumOrder = useMemo(() => [1, 0, 2], [])

  return (
    <main className="wrap" id="beranda">
      {/* HERO */}
      <section className="hero">
        <div>
          <div className="hero-eyebrow">
            <span className="dot"></span> Platform tiket #1 untuk momen yang berkesan
          </div>
          <h1>
            Satu tiket menuju <span className="grad">semesta pengalamanmu</span>
          </h1>
          <p>
            Konser, seminar, workshop, sampai exhibition — temukan dan amankan tiketnya dalam
            hitungan detik, langsung dari galaksi TIXORA.
          </p>
          <div className="hero-actions">
            <a href="#kategori" className="btn btn-solid">
              Jelajahi Event
            </a>
            <button className="btn btn-ghost">Jadi Penyelenggara</button>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <b>{stats ? `${stats.totalEvents}+` : '—'}</b>
              <span>Event terdaftar</span>
            </div>
            <div className="hero-stat">
              <b>{stats ? `${Math.round(stats.totalTicketsSold / 1000)}rb` : '—'}</b>
              <span>Tiket terjual</span>
            </div>
            <div className="hero-stat">
              <b>4.9/5</b>
              <span>Rating pengguna</span>
            </div>
          </div>
        </div>
      </section>

      {/* EVENT TERDEKAT */}
      <section className="block" id="terdekat">
        <div className="section-head">
          <div>
            <h2>Event terdekat</h2>
            <p>Jadwal event yang paling dekat harinya</p>
          </div>
          <a href="#kategori" className="section-link">
            Lihat semua <ArrowRight />
          </a>
        </div>
        <div className="hscroll">
          {nearbyEvents.map((ev) => (
            <div className="near-card" key={ev.id}>
              <div className="near-date">
                <b>{ev.shortDate.day}</b>
                <span>{ev.shortDate.month}</span>
              </div>
              <div className="near-info">
                <h3>{ev.title}</h3>
                <p>
                  {ev.location} · Mulai {ev.formattedPrice}
                </p>
              </div>
            </div>
          ))}
          {nearbyEvents.length === 0 && (
            <p style={{ color: 'var(--white-faint)', fontSize: 14 }}>Belum ada event terdekat.</p>
          )}
        </div>
      </section>

      {/* KATEGORI + LISTING */}
      <section className="block" id="kategori">
        <div className="section-head">
          <div>
            <h2>Pilih sesuai minatmu</h2>
            <p>Lima kategori, satu tempat</p>
          </div>
        </div>

        <div className="chip-row">
          <button
            className={`chip ${activeCategory === 'semua' ? 'active' : ''}`}
            onClick={() => selectCategory('semua')}
          >
            Semua
          </button>
          {categories.map((c) => {
            const Icon = getCategoryIcon(c.slug)
            return (
              <button
                key={c.id}
                className={`chip ${activeCategory === c.slug ? 'active' : ''}`}
                onClick={() => selectCategory(c.slug)}
              >
                <Icon />
                {c.nama}
              </button>
            )
          })}
        </div>

        <div className="event-grid">
          {eventsLoading && (
            <p style={{ color: 'var(--white-faint)', fontSize: 14 }}>Memuat event...</p>
          )}
          {eventsError && (
            <p style={{ color: 'var(--white-faint)', fontSize: 14 }}>
              Gagal memuat event. Pastikan backend berjalan.
            </p>
          )}
          {!eventsLoading && !eventsError && events.map((ev) => <EventCard key={ev.id} event={ev} />)}
          {!eventsLoading && !eventsError && events.length === 0 && (
            <p style={{ color: 'var(--white-faint)', fontSize: 14 }}>
              Belum ada event untuk filter ini.
            </p>
          )}
        </div>
      </section>

      {/* TRENDING */}
      <section className="block" id="trending">
        <div className="section-head">
          <div>
            <h2>Trending minggu ini</h2>
            <p>Paling banyak dicari pengguna TIXORA</p>
          </div>
        </div>
        <div className="podium">
          {podiumOrder.map((idx) => {
            const ev = trendingEvents[idx]
            if (!ev) return null
            const rankNum = idx + 1
            const Icon = getCategoryIcon(ev.category?.slug)
            return (
              <div className={`podium-card rank-${rankNum}`} key={ev.id}>
                <div className="rank-badge">{rankNum}</div>
                <div className={`podium-thumb ${ev.category?.thumbClass || ''}`}>
                  <Icon color="#fff" strokeWidth={1.6} />
                </div>
                <h3>{ev.title}</h3>
                <p>
                  {ev.formattedDate} · {ev.location}
                </p>
                <span className="podium-tag">{ev.formattedSold}</span>
              </div>
            )
          })}
        </div>
      </section>

      {/* EVENT BERAKHIR */}
      <section className="block">
        <div className="section-head">
          <div>
            <h2>Event berakhir</h2>
            <p>Sudah terlewat, tapi tetap jadi kenangan</p>
          </div>
        </div>
        <div className="ended-grid">
          {endedEvents.map((ev) => {
            const Icon = getCategoryIcon(ev.category?.slug)
            return (
              <div className="ended-card" key={ev.id}>
                <div className={`ended-thumb ${ev.category?.thumbClass || ''}`}>
                  <span className="ended-overlay">Event Berakhir</span>
                  <Icon color="#fff" strokeWidth={1.6} />
                </div>
                <div className="ended-body">
                  <h3>{ev.title}</h3>
                  <p>
                    {ev.formattedDate} · {ev.location}
                  </p>
                </div>
              </div>
            )
          })}
          {endedEvents.length === 0 && (
            <p style={{ color: 'var(--white-faint)', fontSize: 14 }}>
              Belum ada event yang berakhir.
            </p>
          )}
        </div>
      </section>
    </main>
  )
}
