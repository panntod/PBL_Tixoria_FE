import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import EventCard from '../components/EventCard'
import { EmptyState, ErrorState, EventGridSkeleton } from '../components/States'
import { listCategories, listEvents } from '../lib/services'

export default function ExplorePage() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''
  const category = params.get('category') || 'semua'
  const when = params.get('when') || 'kapan-saja'
  const price = params.get('price') || 'semua'
  const sort = params.get('sort') || 'terdekat'
  const past = params.get('past') === '1'

  const [page, setPage] = useState(1)
  const [draft, setDraft] = useState(q)

  // Reset paginasi tiap filter berubah; sinkronkan kolom cari dengan URL.
  useEffect(() => {
    setPage(1)
  }, [q, category, when, price, sort, past])
  useEffect(() => {
    setDraft(q)
  }, [q])

  function update(patch) {
    setParams((prev) => {
      const next = new URLSearchParams(prev)
      Object.entries(patch).forEach(([key, value]) => {
        const empty = !value || ['semua', 'kapan-saja', 'terdekat', '0'].includes(value)
        if (empty) next.delete(key)
        else next.set(key, value)
      })
      return next
    })
  }

  function submit(e) {
    e.preventDefault()
    update({ q: draft.trim() })
  }

  const { data: categories = [] } = useQuery({ queryKey: ['categories'], queryFn: listCategories })
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['events', 'list', { q, category, when, price, sort, past, page }],
    queryFn: () => listEvents({ q, category, when, price, sort, past, page }),
    placeholderData: (prev) => prev,
  })

  const items = data?.items ?? []
  const hasFilters = q || category !== 'semua' || when !== 'kapan-saja' || price !== 'semua' || past

  return (
    <div className="page">
      <div className="container">
        <div className="explore-head">
          <div>
            <h1 className="page-title">Jelajahi acara</h1>
            <p className="page-sub">
              {data ? `${data.total} acara ditemukan di Malang dan sekitarnya` : 'Mencari acara…'}
            </p>
          </div>
          <div className="field sort-box">
            <label htmlFor="sort">Urutkan</label>
            <select id="sort" className="select" value={sort} onChange={(e) => update({ sort: e.target.value })}>
              <option value="terdekat">Terdekat</option>
              <option value="termurah">Termurah</option>
              <option value="termahal">Termahal</option>
            </select>
          </div>
        </div>

        <form className="filter-bar" onSubmit={submit} role="search">
          <label className="sr-only" htmlFor="q">
            Cari acara
          </label>
          <input
            id="q"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Cari acara, topik, atau penyelenggara"
          />
          <label className="sr-only" htmlFor="when">
            Waktu
          </label>
          <select id="when" className="select" value={when} onChange={(e) => update({ when: e.target.value })}>
            <option value="kapan-saja">Kapan saja</option>
            <option value="minggu-ini">Minggu ini</option>
            <option value="bulan-ini">Bulan ini</option>
            <option value="akhir-pekan">Akhir pekan</option>
          </select>
          <label className="sr-only" htmlFor="price">
            Harga
          </label>
          <select id="price" className="select" value={price} onChange={(e) => update({ price: e.target.value })}>
            <option value="semua">Semua harga</option>
            <option value="gratis">Gratis</option>
            <option value="berbayar">Berbayar</option>
          </select>
          <button type="submit" className="btn btn-primary">
            Cari
          </button>
        </form>

        <div className="filter-row">
          <div className="chips" role="group" aria-label="Kategori">
            {[{ slug: 'semua', nama: 'Semua' }, ...categories].map((c) => (
              <button
                key={c.slug}
                type="button"
                className="chip"
                aria-pressed={category === c.slug}
                onClick={() => update({ category: c.slug })}
              >
                {c.nama}
              </button>
            ))}
          </div>
          <button type="button" className="toggle-past" onClick={() => update({ past: past ? '0' : '1' })}>
            Tampilkan acara yang sudah lewat <b>{past ? 'Ya' : 'Tidak'}</b>
          </button>
        </div>

        {isLoading && <EventGridSkeleton count={8} />}
        {isError && <ErrorState title="Gagal memuat acara" onRetry={refetch} />}
        {!isLoading && !isError && items.length === 0 && (
          <EmptyState
            icon="?"
            title={q ? `Tidak ada acara untuk “${q}”` : 'Tidak ada acara'}
            text="Coba kata kunci lain atau hapus filter."
            action={
              hasFilters && (
                <button type="button" className="btn btn-outline" onClick={() => setParams({})}>
                  Hapus semua filter
                </button>
              )
            }
          />
        )}
        {!isLoading && !isError && items.length > 0 && (
          <>
            <div className="event-grid">
              {items.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
            {data.hasMore && (
              <div className="load-more">
                <button type="button" className="btn btn-outline" disabled={isFetching} onClick={() => setPage((p) => p + 1)}>
                  {isFetching ? 'Memuat…' : 'Muat lebih banyak'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
