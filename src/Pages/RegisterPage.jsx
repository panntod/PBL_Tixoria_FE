import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { isValidEmail } from '../lib/format'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ nama: '', email: '', password: '' })
  const [agree, setAgree] = useState(false)
  const [touched, setTouched] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [loading, setLoading] = useState(false)

  const errors = {
    nama: form.nama.trim() ? '' : 'Isi nama lengkap Anda.',
    email: isValidEmail(form.email) ? '' : 'Format surel tidak valid. Contoh: nama@email.com',
    password: form.password.length >= 8 ? '' : 'Kata sandi minimal 8 karakter.',
    agree: agree ? '' : 'Setujui Syarat & ketentuan untuk melanjutkan.',
  }

  function set(key) {
    return (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  }
  const blur = (key) => () => setTouched((t) => ({ ...t, [key]: true }))
  const show = (key) => touched[key] && errors[key]

  async function submit(e) {
    e.preventDefault()
    setTouched({ nama: true, email: true, password: true, agree: true })
    if (Object.values(errors).some(Boolean)) return
    setSubmitError('')
    setLoading(true)
    try {
      await register(form.nama.trim(), form.email.trim(), form.password)
      navigate('/events', { replace: true })
    } catch (err) {
      setSubmitError(err.message || 'Gagal membuat akun. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrap top">
      <div className="card auth-card">
        <h1>Buat akun</h1>
        <p className="lead">Gratis untuk peserta. Hanya butuh satu menit.</p>
        <form onSubmit={submit} noValidate>
          {submitError && (
            <div className="alert alert-error" role="alert">
              {submitError}
            </div>
          )}
          <div className="field">
            <label htmlFor="nama">Nama lengkap</label>
            <input
              id="nama"
              autoComplete="name"
              className={`input ${show('nama') ? 'invalid' : ''}`}
              value={form.nama}
              onChange={set('nama')}
              onBlur={blur('nama')}
              aria-invalid={!!show('nama')}
            />
            {show('nama') && <span className="error-text">{errors.nama}</span>}
          </div>
          <div className="field">
            <label htmlFor="email">Surel</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className={`input ${show('email') ? 'invalid' : ''}`}
              value={form.email}
              onChange={set('email')}
              onBlur={blur('email')}
              aria-invalid={!!show('email')}
            />
            {show('email') && <span className="error-text">{errors.email}</span>}
          </div>
          <div className="field">
            <label htmlFor="password">Kata sandi</label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              className={`input ${show('password') ? 'invalid' : ''}`}
              value={form.password}
              onChange={set('password')}
              onBlur={blur('password')}
              aria-invalid={!!show('password')}
            />
            {show('password') ? (
              <span className="error-text">{errors.password}</span>
            ) : (
              <span className="hint">Minimal 8 karakter.</span>
            )}
          </div>
          <div>
            <label className="check">
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
              <span>Saya menyetujui Syarat &amp; ketentuan dan Kebijakan privasi.</span>
            </label>
            {show('agree') && <span className="error-text">{errors.agree}</span>}
          </div>
          <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
            {loading ? 'Memproses…' : 'Buat akun'}
          </button>
          <p className="auth-foot">
            Sudah punya akun?
            <Link to="/login" className="link">
              Masuk
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
