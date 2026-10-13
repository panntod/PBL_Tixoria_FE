import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import EventCard from '../components/EventCard'
import EventCover from '../components/EventCover'
import QrCode from '../components/QrCode'
import { EmptyState, ErrorState, EventGridSkeleton } from '../components/States'
import { listCategories, listFeaturedEvents } from '../lib/services'

function Hero() {
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('semua')
  const { data: categories = [] } = useQuery({ queryKey: ['categories'], queryFn: listCategories })

  function submit(e) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (q.trim()) params.set('q', q.trim())
    if (category !== 'semua') params.set('category', category)
    navigate(`/events${params.toString() ? `?${params}` : ''}`)
  }

  return (
    <section className="hero">
      <div className="container">
        <div>
          <span className="badge badge-primary">Seminar, workshop, konferensi</span>
          <h1>
            Temukan acaranya. Simpan tiketnya.
            <span className="accent">Masuk tanpa antre.</span>
          </h1>
          <p className="lead">
            TIXORA mempertemukan peserta dan penyelenggara acara kampus maupun umum: pendaftaran, tiket QR, dan
            persetujuan acara dalam satu tempat.
          </p>

          <form className="search-bar" onSubmit={submit} role="search">
            <label className="sr-only" htmlFor="hero-q">
              Cari acara
            </label>
            <input
              id="hero-q"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari acara, topik, atau penyelenggara"
            />
            <label className="sr-only" htmlFor="hero-cat">
              Kategori
            </label>
            <select id="hero-cat" className="select" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="semua">Semua kategori</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.nama}
                </option>
              ))}
            </select>
            <button type="submit" className="btn btn-primary">
              Cari acara
            </button>
          </form>

          <div className="popular">
            <span>Populer:</span>
            <Link className="chip chip-soft" to="/events?category=seminar" style={{ display: 'inline-flex', alignItems: 'center' }}>
              Seminar
            </Link>
            <Link className="chip chip-soft" to="/events?category=workshop" style={{ display: 'inline-flex', alignItems: 'center' }}>
              Workshop
            </Link>
            <Link className="chip chip-soft" to="/events?price=gratis" style={{ display: 'inline-flex', alignItems: 'center' }}>
              Gratis
            </Link>
            <Link className="chip chip-soft" to="/events?when=akhir-pekan" style={{ display: 'inline-flex', alignItems: 'center' }}>
              Akhir pekan ini
            </Link>
          </div>
        </div>

        <div className="ticket-art" aria-hidden="true">
          <EventCover theme="indigo" variant="ticket" eyebrow="SABTU · 24 OKT 2026" title={'SENTEK\n2026'} />
          <div className="ticket-body">
            <div>
              <span className="badge badge-green">Sah</span>
              <h3>Seminar Nasional Teknologi Informatika</h3>
              <p className="meta">Auditorium Utama, Malang · 08.00 WIB</p>
              <p className="ticket-code">TXR-2610-0482</p>
            </div>
            <QrCode value="TXR-2610-0482" />
          </div>
        </div>
      </div>
    </section>
  )
}

function Featured() {
  const [category, setCategory] = useState('semua')
  const { data: categories = [] } = useQuery({ queryKey: ['categories'], queryFn: listCategories })
  const { data: events = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['events', 'featured', category],
    queryFn: () => listFeaturedEvents(category),
  })

  return (
    <section className="section" style={{ paddingTop: 24 }}>
      <div className="container">
        <div className="section-head">
          <h2>Acara pilihan minggu ini</h2>
          <Link to="/events" className="btn btn-outline btn-sm">
            Lihat semua acara
          </Link>
        </div>

        <div className="tabs" role="tablist" aria-label="Kategori acara" style={{ marginBottom: 22 }}>
          {[{ slug: 'semua', nama: 'Semua' }, ...categories].map((c) => (
            <button
              key={c.slug}
              type="button"
              role="tab"
              className="tab"
              aria-selected={category === c.slug}
              onClick={() => setCategory(c.slug)}
            >
              {c.nama}
            </button>
          ))}
        </div>

        {isLoading && <EventGridSkeleton />}
        {isError && <ErrorState title="Gagal memuat acara" onRetry={refetch} />}
        {!isLoading && !isError && events.length === 0 && (
          <EmptyState icon="?" title="Belum ada acara" text="Belum ada acara pada kategori ini." />
        )}
        {!isLoading && !isError && events.length > 0 && (
          <div className="event-grid">
            {events.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    ['Temukan acara', 'Cari berdasarkan kategori, tanggal, atau harga. Status kursi dan jadwal terlihat sebelum Anda mendaftar.'],
    ['Daftar atau beli tiket', 'Pilih kategori tiket, isi data peserta, lalu terima konfirmasi dan tiket digital Anda.'],
    ['Tunjukkan kode QR', 'Tiket tersimpan di akun Anda. Petugas memindai kode QR dan status tiket langsung berubah.'],
  ]
  return (
    <section className="section" id="cara-kerja">
      <div className="container">
        <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.01em' }}>Dari pendaftaran sampai pintu masuk</h2>
        <div className="steps3">
          {steps.map(([title, text], i) => (
            <div key={title}>
              <div className="step-num">{i + 1}</div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Organizer() {
  return (
    <section className="section" id="penyelenggara" style={{ paddingTop: 24 }}>
      <div className="container">
        <div className="card organizer">
          <div>
            <span className="badge badge-primary">Untuk penyelenggara</span>
            <h2>Kelola acara dari draf sampai terbit.</h2>
            <ul>
              <li>Wizard pembuatan acara dengan rundown dan kategori tiket.</li>
              <li>Pantau pendaftar, kuota, dan anggaran (RAB) di satu dasbor.</li>
              <li>Ajukan ke admin, dapatkan keputusan beserta alasannya, lalu revisi bila perlu.</li>
            </ul>
            <Link to="/register" className="btn btn-primary">
              Ajukan acara Anda
            </Link>
          </div>
          <div className="flow" aria-label="Contoh alur persetujuan">
            <div className="flow-label">Alur persetujuan</div>
            <div className="flow-legend">
              <span className="badge badge-neutral">Draf</span>
              <span className="badge badge-orange">Menunggu tinjauan</span>
              <span className="badge badge-blue">Disetujui</span>
              <span className="badge badge-green">Terbit</span>
            </div>
            <div className="flow-item">
              Lomba Esai Nasional Mahasiswa <span className="badge badge-red">Ditolak</span>
            </div>
            <p className="flow-note">Alasan: rincian anggaran belum dilampirkan. Revisi lalu ajukan ulang.</p>
            <div className="flow-item">
              Konferensi Pendidikan Digital Jawa Timur <span className="badge badge-orange">Menunggu tinjauan</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function CtaBand() {
  return (
    <section style={{ paddingTop: 24 }}>
      <div className="container">
        <div className="cta-band">
          <h2>Punya acara berikutnya? Mulai dari satu draf.</h2>
          <div className="row">
            <Link to="/register" className="btn btn-dark">
              Buat akun penyelenggara
            </Link>
            <Link to="/events" className="btn btn-outline">
              Jelajahi acara
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Featured />
      <HowItWorks />
      <Organizer />
      <CtaBand />
    </>
  )
}
