import { api } from './api'
import { CATEGORIES, EVENTS, SEED_REGISTRATIONS } from './mock'

export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

const THEMES = ['indigo', 'mint', 'dark', 'amber']
const PAGE_SIZE = 8

/* ---------------------------------------------------------------- events */

function parsePrice(raw) {
  if (typeof raw.price === 'number') return raw.price
  if (typeof raw.minPrice === 'number') return raw.minPrice
  const digits = String(raw.formattedPrice ?? '').replace(/[^\d]/g, '')
  return digits ? Number(digits) : 0
}

// Menyamakan bentuk data backend ke bentuk yang dipakai tampilan baru.
export function normalizeEvent(raw) {
  if (!raw || raw.coverLabel) return raw // sudah dalam bentuk mock
  const date = raw.date || raw.startDate || raw.startsAt || null
  const seats = raw.seatsLeft ?? raw.sisaKursi ?? raw.remaining ?? null
  const price = parsePrice(raw)
  const tickets =
    raw.tickets?.length > 0
      ? raw.tickets
      : [{ id: 'umum', name: 'Umum', price, seats: seats ?? 100 }]

  let status = raw.status
  const map = { cancelled: 'dibatalkan', canceled: 'dibatalkan', ended: 'selesai', finished: 'selesai', sold_out: 'habis' }
  status = map[status] || status
  if (!['akan-datang', 'hampir-penuh', 'habis', 'selesai', 'dibatalkan'].includes(status)) {
    if (date && new Date(date) < new Date()) status = 'selesai'
    else if (seats === 0) status = 'habis'
    else if (seats !== null && seats <= 10) status = 'hampir-penuh'
    else status = 'akan-datang'
  }

  return {
    id: raw.id,
    title: raw.title,
    category: raw.category || { id: 0, slug: 'umum', nama: 'Acara' },
    date,
    dateLabel: raw.formattedDate,
    time: raw.time || '',
    location: raw.location || '',
    address: raw.address || raw.location || '',
    organizer: raw.organizer || '',
    theme: raw.theme || THEMES[(raw.category?.id ?? raw.id ?? 0) % THEMES.length],
    coverLabel: raw.coverLabel || raw.title,
    status,
    description: raw.description || '',
    rundown: raw.rundown || [],
    tickets,
    closeDate: raw.closeDate || null,
    cancelDate: raw.cancelDate || null,
  }
}

export function minPrice(event) {
  const prices = event.tickets.map((t) => t.price)
  return prices.length ? Math.min(...prices) : 0
}

export function totalSeats(event) {
  return event.tickets.reduce((sum, t) => sum + (t.seats || 0), 0)
}

function matchWhen(event, when) {
  if (!when || when === 'kapan-saja' || !event.date) return true
  const d = new Date(event.date)
  const now = new Date()
  if (when === 'minggu-ini') return d >= now && d - now <= 7 * 864e5
  if (when === 'bulan-ini') return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  if (when === 'akhir-pekan') return [0, 6].includes(d.getDay())
  return true
}

export function filterEvents(events, { q = '', category = 'semua', when, price, sort = 'terdekat', past = false }) {
  const needle = q.trim().toLowerCase()
  let list = events.filter((e) => {
    if (!past && e.status === 'selesai') return false
    if (category !== 'semua' && e.category?.slug !== category) return false
    if (needle && !`${e.title} ${e.organizer} ${e.location} ${e.category?.nama}`.toLowerCase().includes(needle)) return false
    if (!matchWhen(e, when)) return false
    if (price === 'gratis' && minPrice(e) !== 0) return false
    return true
  })
  list = [...list].sort((a, b) => {
    if (sort === 'termurah') return minPrice(a) - minPrice(b)
    if (sort === 'termahal') return minPrice(b) - minPrice(a)
    return new Date(a.date) - new Date(b.date)
  })
  return list
}

async function fetchAllEvents(params = {}) {
  if (USE_MOCK) return EVENTS
  const list = await api.getEvents({ category: params.category, search: params.q })
  return list.map(normalizeEvent)
}

export async function listCategories() {
  if (USE_MOCK) return CATEGORIES
  return api.getCategories()
}

export async function listEvents(params = {}) {
  const all = await fetchAllEvents(params)
  const filtered = filterEvents(all, params)
  const limit = (params.page || 1) * PAGE_SIZE
  return { items: filtered.slice(0, limit), total: filtered.length, hasMore: filtered.length > limit }
}

export async function listFeaturedEvents(category = 'semua') {
  const all = await fetchAllEvents({ category })
  return filterEvents(all, { category }).slice(0, 4)
}

export async function getEvent(id) {
  if (USE_MOCK) {
    const found = EVENTS.find((e) => e.id === id)
    if (!found) throw new Error('Acara tidak ditemukan.')
    return found
  }
  return normalizeEvent(await api.getEvent(id))
}

/* --------------------------------------------------------- registrations */

const REG_KEY = 'tixora_registrations_v1'

function readRegs() {
  try {
    const raw = localStorage.getItem(REG_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* abaikan */
  }
  return SEED_REGISTRATIONS
}

function writeRegs(list) {
  try {
    localStorage.setItem(REG_KEY, JSON.stringify(list))
  } catch {
    /* abaikan */
  }
}

async function findEvent(id) {
  const fromMock = EVENTS.find((e) => e.id === id)
  if (fromMock) return fromMock
  try {
    return await getEvent(id)
  } catch {
    return null
  }
}

async function attachEvent(reg) {
  return { ...reg, event: await findEvent(reg.eventId) }
}

export async function listRegistrations() {
  return Promise.all(readRegs().map(attachEvent))
}

export async function getRegistration(orderNo) {
  const reg = readRegs().find((r) => r.orderNo === orderNo)
  if (!reg) throw new Error('Pendaftaran tidak ditemukan.')
  return attachEvent(reg)
}

export async function createRegistration({ event, ticket, qty, participant }) {
  const now = new Date()
  const yymm = `${String(now.getFullYear()).slice(2)}${String(now.getMonth() + 1).padStart(2, '0')}`
  const orderNo = `TXR-${yymm}-${String(Math.floor(Math.random() * 9000) + 1000)}`
  const reg = {
    orderNo,
    eventId: event.id,
    ticketId: ticket.id,
    ticketName: ticket.name,
    qty,
    total: ticket.price * qty,
    status: 'sah',
    participant,
  }
  writeRegs([reg, ...readRegs()])
  return attachEvent(reg)
}

export async function payRegistration(orderNo) {
  writeRegs(readRegs().map((r) => (r.orderNo === orderNo ? { ...r, status: 'sah' } : r)))
}

/** Tab pada "Tiket saya" / "Riwayat": pengelompokan status */
export function groupOf(reg) {
  if (reg.status === 'dibatalkan') return 'dibatalkan'
  if (reg.status === 'dipakai') return 'selesai'
  return 'akan-datang'
}
