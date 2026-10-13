import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'

export default function AccountLayout() {
  const { pathname, hash } = useLocation()
  const onProfile = pathname === '/account'
  const link = ({ isActive }) => (isActive ? 'active' : '')

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Akun saya</h1>
        <div className="account-grid">
          <nav className="side-nav" aria-label="Menu akun">
            <Link to="/account" className={onProfile && hash !== '#keamanan' ? 'active' : ''}>
              Profil
            </Link>
            <Link to="/account#keamanan" className={onProfile && hash === '#keamanan' ? 'active' : ''}>
              Keamanan
            </Link>
            <NavLink to="/account/notifikasi" className={link}>
              Notifikasi
            </NavLink>
            <NavLink to="/account/riwayat" className={link}>
              Riwayat pendaftaran
            </NavLink>
          </nav>
          <div className="account-main">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
