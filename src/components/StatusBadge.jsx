const EVENT_STATUS = {
  'akan-datang': ['badge-primary', 'Akan datang'],
  'hampir-penuh': ['badge-orange', 'Hampir penuh'],
  habis: ['badge-neutral', 'Tiket habis'],
  selesai: ['badge-neutral', 'Selesai'],
  dibatalkan: ['badge-red', 'Dibatalkan'],
}

const REG_STATUS = {
  sah: ['badge-green', 'Sah'],
  menunggu: ['badge-orange', 'Menunggu'],
  dipakai: ['badge-neutral', 'Sudah dipakai'],
  dibatalkan: ['badge-red', 'Dibatalkan'],
}

export function EventStatusBadge({ status }) {
  const [cls, label] = EVENT_STATUS[status] || EVENT_STATUS['akan-datang']
  return <span className={`badge ${cls}`}>{label}</span>
}

export function RegistrationStatusBadge({ status }) {
  const [cls, label] = REG_STATUS[status] || REG_STATUS.sah
  return <span className={`badge ${cls}`}>{label}</span>
}
