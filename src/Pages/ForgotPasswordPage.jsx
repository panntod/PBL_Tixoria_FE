import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { isValidEmail } from '../lib/format'

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth()
  const toast = useToast()
  const [email, setEmail] = useState('')
  const [touched, setTouched] = useState(false)
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const error = isValidEmail(email) ? '' : 'Format surel tidak valid. Contoh: nama@email.com'

  async function send() {
    setLoading(true)
    try {
      await forgotPassword(email.trim())
      setSent(true)
    } catch {
      toast('Gagal mengirim tautan. Coba lagi.', 'error')
    } finally {
      setLoading(false)
    }
  }

  function submit(e) {
    e.preventDefault()
    setTouched(true)
    if (!error) send()
  }

  async function resend() {
    await send()
    toast('Tautan atur ulang dikirim ulang.')
  }

  if (sent) {
    return (
      <div className="auth-wrap top">
        <div className="card auth-card center">
          <div className="status-icon ok">
            <Check />
          </div>
          <h1>Periksa surel Anda</h1>
          <p className="lead">
            Jika {email.trim()} terdaftar, tautan atur ulang kata sandi sudah dikirim.
          </p>
          <Link to="/login" className="btn btn-outline btn-block btn-lg">
            Kembali ke halaman masuk
          </Link>
          <p className="auth-foot" style={{ marginTop: 18 }}>
            Tidak menerima surel?
            <button type="button" className="link" style={{ background: 'none', border: 0, padding: 0, marginLeft: 4, font: 'inherit', fontWeight: 700 }} onClick={resend}>
              Kirim ulang
            </button>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-wrap top">
      <div className="card auth-card">
        <h1>Lupa kata sandi?</h1>
        <p className="lead">Masukkan surel akun Anda. Kami kirim tautan untuk mengatur ulang kata sandi.</p>
        <form onSubmit={submit} noValidate>
          <div className="field">
            <label htmlFor="email">Surel</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className={`input ${touched && error ? 'invalid' : ''}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched(true)}
              aria-invalid={touched && !!error}
            />
            {touched && error && <span className="error-text">{error}</span>}
          </div>
          <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
            {loading ? 'Mengirim…' : 'Kirim tautan atur ulang'}
          </button>
          <p className="auth-foot">
            <Link to="/login" className="link" style={{ marginLeft: 0 }}>
              ← Kembali ke halaman masuk
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
