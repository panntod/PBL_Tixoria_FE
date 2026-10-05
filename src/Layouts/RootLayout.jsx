import { useState } from 'react'
import { Outlet, NavLink, Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Search, LogOut } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
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

export default function RootLayout() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [searchInput, setSearchInput] = useState(searchParams.get('q') || '')
  const { user, isAuthenticated, logout } = useAuth()

  function handleLogout() {
    logout()
    navigate('/')
  }

  function handleSearchKeyDown(e) {
    if (e.key === 'Enter') {
      const q = searchInput.trim()
      navigate(q ? `/?q=${encodeURIComponent(q)}` : '/')
    }
  }

  return (
    <div>
      <Starfield />

      <header>
        <div className="wrap header-inner">
          <Link to="/" className="logo">
            <LogoMark />
            TIXORA
          </Link>
          <nav className="main-nav">
            <NavLink to="/" end className={({ isActive }) => (isActive ? 'current' : '')}>
              Beranda
            </NavLink>
            <NavLink to="/events" className={({ isActive }) => (isActive ? 'current' : '')}>
              Explore
            </NavLink>
            <NavLink to="/biaya" className={({ isActive }) => (isActive ? 'current' : '')}>
              Biaya
            </NavLink>
            <NavLink to="/tiket-gelang" className={({ isActive }) => (isActive ? 'current' : '')}>
              Tiket gelang
            </NavLink>
          </nav>
          <div className="header-actions">
            <div className="search-pill">
              <Search />
              <input
                type="text"
                placeholder="Cari event, artis, kota..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleSearchKeyDown}
              />
            </div>
            {isAuthenticated ? (
              <>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--white-dim)' }}>
                  Hai, {user.nama.split(' ')[0]}
                </span>
                <button
                  className="btn btn-ghost"
                  onClick={handleLogout}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <LogOut size={16} />
                  Keluar
                </button>
              </>
            ) : (
              <>
                <button className="btn btn-ghost" onClick={() => navigate('/login')}>
                  Masuk
                </button>
                <button className="btn btn-solid" onClick={() => navigate('/register')}>
                  Daftar
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <Outlet />

      <SiteFooter />
    </div>
  )
}

function SiteFooter() {
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: api.getCategories,
  })

  return (
    <footer>
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="logo">
              <LogoMark />
              TIXORA
            </div>
            <p>Ruang temu untuk setiap konser, seminar, workshop, dan pengalaman yang layak diingat.</p>
          </div>
          <div className="footer-col">
            <h4>Jelajahi</h4>
            {categories.map((c) => (
              <Link key={c.id} to={`/?category=${c.slug}#kategori`}>
                {c.nama}
              </Link>
            ))}
          </div>
          <div className="footer-col">
            <h4>Perusahaan</h4>
            <a href="#">Tentang TIXORA</a>
            <a href="#">Jadi Penyelenggara</a>
            <a href="#">Karier</a>
            <a href="#">Bantuan</a>
          </div>
          <div className="footer-col">
            <h4>Ikuti kami</h4>
            <a href="#">Instagram</a>
            <a href="#">TikTok</a>
            <a href="#">X (Twitter)</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 TIXORA. Semua hak dilindungi.</span>
          <span>Dibuat untuk generasi yang suka pengalaman baru.</span>
        </div>
      </div>
    </footer>
  )
}