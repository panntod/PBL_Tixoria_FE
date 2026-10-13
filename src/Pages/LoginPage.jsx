import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function set(key) {
    return (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  }

  async function submit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email.trim(), form.password)
      // TODO (role admin / owner event): arahkan ke dasbor masing-masing setelah desainnya diiris.
      navigate(location.state?.from || '/events', { replace: true })
    } catch (err) {
      setError(err.message || 'Surel atau kata sandi salah. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrap">
      <div className="card auth-card">
        <h1>Masuk</h1>
        <p className="lead">Akses tiket dan riwayat pendaftaran Anda.</p>
        <form onSubmit={submit} noValidate>
          {error && (
            <div className="alert alert-error" role="alert">
              {error}
            </div>
          )}
          <div className="field">
            <label htmlFor="email">Surel</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className="input"
              value={form.email}
              onChange={set('email')}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="password">Kata sandi</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className="input"
              value={form.password}
              onChange={set('password')}
              required
            />
          </div>
          <div>
            <Link to="/forgot-password" className="link" style={{ fontSize: 13 }}>
              Lupa kata sandi?
            </Link>
          </div>
          <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
            {loading ? 'Memproses…' : 'Masuk'}
          </button>
          <p className="auth-foot">
            Belum punya akun?
            <Link to="/register" className="link">
              Daftar
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
