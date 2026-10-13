import { useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import { useAuth } from '../context/AuthContext'
import { initials } from '../lib/format'

function useScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView()
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div>
          <Logo />
          <p>Platform acara dan tiket digital.</p>
        </div>
        <nav className="footer-links" aria-label="Tautan bawah">
          <a href="#">Bantuan</a>
          <a href="#">Syarat &amp; ketentuan</a>
          <a href="#">Kebijakan privasi</a>
        </nav>
      </div>
    </footer>
  )
}

function SiteHeader() {
  const { user, isAuthenticated, logout } = useAuth()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const isLanding = pathname === '/'

  function handleLogout() {
    logout()
    navigate('/')
  }

  const navClass = ({ isActive }) => (isActive ? 'active' : '')

  return (
    <header className="site-header">
      <div className="container">
        <Logo />
        <nav className="main-nav" aria-label="Navigasi utama">
          <NavLink to="/events" className={navClass}>
            Jelajahi acara
          </NavLink>
          {isAuthenticated ? (
            <NavLink to="/my-tickets" className={navClass}>
              Tiket saya
            </NavLink>
          ) : (
            isLanding && (
              <>
                <Link to="/#cara-kerja">Cara kerja</Link>
                <Link to="/#penyelenggara">Untuk penyelenggara</Link>
              </>
            )
          )}
        </nav>
        <div className="header-actions">
          {isAuthenticated ? (
            <>
              <Link to="/account" className="avatar" aria-label="Akun saya" title={user?.nama}>
                {initials(user?.nama)}
              </Link>
              <button type="button" className="link-strong" onClick={handleLogout}>
                Keluar
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="link-strong">
                Masuk
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Daftar
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default function RootLayout() {
  useScrollManager()
  return (
    <div className="app">
      <SiteHeader />
      <main>
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}

// Layout tanpa header untuk halaman masuk & daftar (sesuai desain).
export function AuthLayout() {
  useScrollManager()
  return (
    <div className="app">
      <main>
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}
