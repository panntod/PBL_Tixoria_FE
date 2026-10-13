import { useState } from 'react'

const ITEMS = [
  ['pengingat', 'Pengingat acara', 'Surel sehari sebelum acara dimulai.'],
  ['perubahan', 'Perubahan jadwal atau pembatalan', 'Kabar penting dari penyelenggara acara yang Anda ikuti.'],
  ['rekomendasi', 'Rekomendasi acara', 'Acara baru yang sesuai kategori favorit Anda.'],
]

export default function AccountNotificationsPage() {
  const [on, setOn] = useState({ pengingat: true, perubahan: true, rekomendasi: false })
  return (
    <div className="card card-pad">
      <h2>Notifikasi</h2>
      <div style={{ marginTop: 8 }}>
        {ITEMS.map(([key, title, text]) => (
          <label className="switch-row" key={key}>
            <span>
              {title}
              <small>{text}</small>
            </span>
            <input type="checkbox" checked={on[key]} onChange={(e) => setOn((s) => ({ ...s, [key]: e.target.checked }))} />
          </label>
        ))}
      </div>
    </div>
  )
}
