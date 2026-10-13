import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { initials, isValidEmail } from '../lib/format'

function ProfileCard() {
  const { user, updateProfile } = useAuth()
  const fileRef = useRef(null)
  const [photo, setPhoto] = useState(null)
  const [form, setForm] = useState({
    nama: user?.nama || '',
    email: user?.email || '',
    whatsapp: user?.whatsapp || '',
    institusi: user?.institusi || '',
  })
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const set = (key) => (e) => {
    setSaved(false)
    setForm((f) => ({ ...f, [key]: e.target.value }))
  }

  function pickPhoto(e) {
    const file = e.target.files?.[0]
    if (file) setPhoto(URL.createObjectURL(file)) // TODO: unggah ke backend
  }

  async function submit(e) {
    e.preventDefault()
    if (!form.nama.trim()) return setError('Nama lengkap tidak boleh kosong.')
    if (!isValidEmail(form.email)) return setError('Format surel tidak valid. Contoh: nama@email.com')
    setError('')
    setSaving(true)
    try {
      await updateProfile(form)
      setSaved(true)
    } catch (err) {
      setError(err.message || 'Perubahan gagal disimpan. Coba lagi.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      {saved && (
        <div className="alert alert-success" role="status">
          Perubahan profil tersimpan.
        </div>
      )}
      <form className="card card-pad" onSubmit={submit} noValidate>
        <h2>Profil</h2>
        <div className="profile-head">
          <span className="avatar avatar-lg">
            {photo ? <img src={photo} alt="Foto profil" /> : initials(form.nama)}
          </span>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={pickPhoto} />
          <button type="button" className="btn btn-outline btn-sm" onClick={() => fileRef.current?.click()}>
            Ganti foto
          </button>
        </div>
        {error && (
          <div className="alert alert-error" role="alert" style={{ marginBottom: 14 }}>
            {error}
          </div>
        )}
        <div className="form-grid">
          <div className="field">
            <label htmlFor="nama">Nama lengkap</label>
            <input id="nama" className="input" value={form.nama} onChange={set('nama')} />
          </div>
          <div className="field">
            <label htmlFor="email">Surel</label>
            <input id="email" type="email" className="input" value={form.email} onChange={set('email')} />
          </div>
          <div className="field">
            <label htmlFor="wa">Nomor WhatsApp</label>
            <input id="wa" type="tel" className="input" value={form.whatsapp} onChange={set('whatsapp')} />
          </div>
          <div className="field">
            <label htmlFor="inst">Institusi</label>
            <input id="inst" className="input" value={form.institusi} onChange={set('institusi')} />
          </div>
        </div>
        <button type="submit" className="btn btn-primary" style={{ marginTop: 18 }} disabled={saving}>
          {saving ? 'Menyimpan…' : 'Simpan perubahan'}
        </button>
      </form>
    </>
  )
}

function PasswordCard() {
  const toast = useToast()
  const [form, setForm] = useState({ baru: '', ulang: '' })
  const [error, setError] = useState('')

  function submit(e) {
    e.preventDefault()
    if (form.baru.length < 8) return setError('Kata sandi minimal 8 karakter.')
    if (form.baru !== form.ulang) return setError('Kata sandi tidak sama. Periksa kembali.')
    setError('')
    // TODO: panggil endpoint ganti kata sandi saat backend siap.
    setForm({ baru: '', ulang: '' })
    toast('Kata sandi diperbarui.')
  }

  return (
    <form id="keamanan" className="card card-pad" onSubmit={submit} noValidate style={{ scrollMarginTop: 88 }}>
      <h2>Ganti kata sandi</h2>
      {error && (
        <div className="alert alert-error" role="alert" style={{ marginTop: 14 }}>
          {error}
        </div>
      )}
      <div className="form-grid" style={{ marginTop: 18 }}>
        <div className="field">
          <label htmlFor="baru">Kata sandi baru</label>
          <input id="baru" type="password" autoComplete="new-password" className="input" value={form.baru} onChange={(e) => setForm((f) => ({ ...f, baru: e.target.value }))} />
          <span className="hint">Minimal 8 karakter.</span>
        </div>
        <div className="field">
          <label htmlFor="ulang">Ulangi kata sandi</label>
          <input id="ulang" type="password" autoComplete="new-password" className="input" value={form.ulang} onChange={(e) => setForm((f) => ({ ...f, ulang: e.target.value }))} />
        </div>
      </div>
      <button type="submit" className="btn btn-outline" style={{ marginTop: 18 }}>
        Perbarui kata sandi
      </button>
    </form>
  )
}

function DeleteCard() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  function remove() {
    if (!window.confirm('Hapus akun? Tiket dan riwayat pendaftaran akan hilang permanen.')) return
    // TODO: panggil endpoint hapus akun saat backend siap.
    logout()
    navigate('/')
  }

  return (
    <div className="card danger-row">
      <div>
        <h3>Hapus akun</h3>
        <p>Tiket dan riwayat pendaftaran akan hilang permanen.</p>
      </div>
      <button type="button" className="btn btn-danger btn-sm" onClick={remove}>
        Hapus akun
      </button>
    </div>
  )
}

export default function AccountProfilePage() {
  // pastikan anchor #keamanan tergulir setelah halaman dirender
  useEffect(() => {
    if (window.location.hash === '#keamanan') document.getElementById('keamanan')?.scrollIntoView()
  }, [])
  return (
    <>
      <ProfileCard />
      <PasswordCard />
      <DeleteCard />
    </>
  )
}
