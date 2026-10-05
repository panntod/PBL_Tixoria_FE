import { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, User, Eye, EyeOff, Check, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Starfield from '../components/Starfield'

function LogoMark() {
  return (
    <span className="logo-mark">
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 1 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 1 0 0-4V8Z"
          stroke="#050a24"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path d="M10 7v10" stroke="#050a24" strokeWidth="1.6" strokeDasharray="2 2" />
      </svg>
    </span>
  )
}

export default function AuthPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { login, register } = useAuth()

  const [tab, setTab] = useState(location.pathname === '/register' ? 'register' : 'login')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({ nama: '', email: '', password: '' })

  function switchTab(nextTab) {
    setTab(nextTab)
    setError('')
    navigate(nextTab === 'register' ? '/register' : '/login', { replace: true })
  }

  async function handleLoginSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(loginForm.email, loginForm.password)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Gagal masuk. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  async function handleRegisterSubmit(e) {
    e.preventDefault()
    setError('')

    if (registerForm.password.length < 8) {
      setError('Kata sandi minimal 8 karakter')
      return
    }

    setLoading(true)
    try {
      await register(registerForm.nama, registerForm.email, registerForm.password)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Gagal mendaftar. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <Starfield />

      <Link to="/" className="site-logo">
        <LogoMark />
        TIXORA
      </Link>

      <Link to="/" className="back-home">
        Kembali ke beranda
        <ArrowRight />
      </Link>

      <div className="auth-shell">
        {/* LEFT: brand panel */}
        <div className="brand-panel">
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <LogoMark />
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18 }}>
                TIXORA
              </span>
            </div>
            <h2>
              Satu akun untuk <span className="grad">semua tiketmu</span>
            </h2>
            <p>
              Kelola pesanan, simpan event favorit, dan dapatkan akses early-bird ke konser,
              seminar, dan workshop pilihan.
            </p>

            <div className="feature-list">
              <div className="feature-item">
                <span className="ico">
                  <Check size={15} color="#fff" strokeWidth={2} />
                </span>
                Checkout lebih cepat, tiket langsung ke e-mail
              </div>
              <div className="feature-item">
                <span className="ico">
                  <Check size={15} color="#fff" strokeWidth={2} />
                </span>
                Notifikasi event & promo sesuai minatmu
              </div>
              <div className="feature-item">
                <span className="ico">
                  <Check size={15} color="#fff" strokeWidth={2} />
                </span>
                Riwayat tiket tersimpan rapi di satu tempat
              </div>
            </div>
          </div>

          <svg className="ticket-mini orb-float" viewBox="0 0 300 180" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="gmini" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#8fe3ff" />
                <stop offset="55%" stopColor="#5b7fff" />
                <stop offset="100%" stopColor="#7a3bff" />
              </linearGradient>
            </defs>
            <path
              d="M20 22h260a10 10 0 0 1 10 10v22a17 17 0 0 0 0 34v22a10 10 0 0 1-10 10H20a10 10 0 0 1-10-10v-22a17 17 0 0 0 0-34V32a10 10 0 0 1 10-10Z"
              fill="url(#gmini)"
              opacity="0.9"
            />
            <line x1="205" y1="30" x2="205" y2="152" stroke="#eaf0ff" strokeOpacity="0.5" strokeWidth="2" strokeDasharray="6 6" />
            <circle cx="240" cy="88" r="24" fill="none" stroke="#eaf0ff" strokeWidth="2" strokeOpacity="0.6" />
          </svg>

          <div className="orbit-dot twinkle" style={{ width: 6, height: 6, background: '#8fe3ff', top: '12%', right: '14%', boxShadow: '0 0 10px #8fe3ff' }} />
          <div className="orbit-dot twinkle" style={{ width: 4, height: 4, background: '#fff', top: '30%', right: '28%', boxShadow: '0 0 8px #fff', animationDelay: '1.2s' }} />
        </div>

        {/* RIGHT: form panel */}
        <div className="form-panel">
          <div className="tab-row">
            <button className={`tab-btn ${tab === 'login' ? 'active' : ''}`} onClick={() => switchTab('login')}>
              Masuk
            </button>
            <button className={`tab-btn ${tab === 'register' ? 'active' : ''}`} onClick={() => switchTab('register')}>
              Daftar
            </button>
          </div>

          {error && <div className="auth-error">{error}</div>}

          {tab === 'login' ? (
            <form onSubmit={handleLoginSubmit}>
              <div className="form-title">Selamat datang kembali</div>
              <div className="form-sub">Masuk untuk melanjutkan perjalanan serumu.</div>

              <div className="field">
                <label>Email</label>
                <div className="input-wrap">
                  <Mail />
                  <input
                    type="email"
                    placeholder="nama@email.com"
                    required
                    value={loginForm.email}
                    onChange={(e) => setLoginForm((f) => ({ ...f, email: e.target.value }))}
                  />
                </div>
              </div>

              <div className="field">
                <label>Kata sandi</label>
                <div className="input-wrap">
                  <Lock />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    required
                    value={loginForm.password}
                    onChange={(e) => setLoginForm((f) => ({ ...f, password: e.target.value }))}
                  />
                  <span className="toggle-eye" onClick={() => setShowPassword((v) => !v)}>
                    {showPassword ? <EyeOff /> : <Eye />}
                  </span>
                </div>
              </div>

              <div className="row-between">
                <label className="remember">
                  <input type="checkbox" /> Ingat saya
                </label>
                <a href="#" className="forgot-link">
                  Lupa kata sandi?
                </a>
              </div>

              <button className="btn-submit" type="submit" disabled={loading}>
                {loading ? 'Memproses...' : 'Masuk ke TIXORA'}
              </button>

              <div className="switch-line">
                Belum punya akun?{' '}
                <button type="button" onClick={() => switchTab('register')}>
                  Daftar sekarang
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit}>
              <div className="form-title">Buat akun baru</div>
              <div className="form-sub">Gratis, dan cuma butuh waktu satu menit.</div>

              <div className="field">
                <label>Nama lengkap</label>
                <div className="input-wrap">
                  <User />
                  <input
                    type="text"
                    placeholder="Nama kamu"
                    required
                    value={registerForm.nama}
                    onChange={(e) => setRegisterForm((f) => ({ ...f, nama: e.target.value }))}
                  />
                </div>
              </div>

              <div className="field">
                <label>Email</label>
                <div className="input-wrap">
                  <Mail />
                  <input
                    type="email"
                    placeholder="nama@email.com"
                    required
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm((f) => ({ ...f, email: e.target.value }))}
                  />
                </div>
              </div>

              <div className="field">
                <label>Kata sandi</label>
                <div className="input-wrap">
                  <Lock />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Minimal 8 karakter"
                    required
                    minLength={8}
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm((f) => ({ ...f, password: e.target.value }))}
                  />
                  <span className="toggle-eye" onClick={() => setShowPassword((v) => !v)}>
                    {showPassword ? <EyeOff /> : <Eye />}
                  </span>
                </div>
              </div>

              <button className="btn-submit" type="submit" disabled={loading} style={{ marginTop: 6 }}>
                {loading ? 'Memproses...' : 'Buat Akun'}
              </button>

              <p className="terms-note">
                Dengan mendaftar, kamu menyetujui <a href="#">Syarat & Ketentuan</a> dan{' '}
                <a href="#">Kebijakan Privasi</a> TIXORA.
              </p>

              <div className="switch-line">
                Sudah punya akun?{' '}
                <button type="button" onClick={() => switchTab('login')}>
                  Masuk di sini
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}