const idDate = new Intl.DateTimeFormat('id-ID', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'Asia/Jakarta',
})

function parts(iso) {
  const out = {}
  idDate.formatToParts(new Date(iso)).forEach((p) => {
    out[p.type] = p.value
  })
  return out
}

/** "Sab, 24 Okt 2026" */
export function formatDate(iso) {
  if (!iso) return ''
  const p = parts(iso)
  return `${p.weekday}, ${p.day} ${p.month} ${p.year}`
}

/** "24 Okt 2026" */
export function formatDateShort(iso) {
  if (!iso) return ''
  const p = parts(iso)
  return `${p.day} ${p.month} ${p.year}`
}

/** "SABTU · 24 OKT 2026" dipakai di banner */
export function formatDateLong(iso) {
  if (!iso) return ''
  const weekday = new Intl.DateTimeFormat('id-ID', { weekday: 'long', timeZone: 'Asia/Jakarta' }).format(new Date(iso))
  const p = parts(iso)
  return `${weekday} · ${p.day} ${p.month} ${p.year}`.toUpperCase()
}

/** 75000 -> "Rp75.000" */
export function rupiah(n) {
  const value = Number(n) || 0
  return `Rp${value.toLocaleString('id-ID')}`
}

export function priceLabel(n) {
  return Number(n) === 0 ? 'Gratis' : rupiah(n)
}

export function initials(name = '') {
  const letters = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
  return letters || '?'
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
export function isValidEmail(value) {
  return EMAIL_RE.test(String(value).trim())
}
