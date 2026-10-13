import { Link } from 'react-router-dom'
import { SiteFooter } from '../layouts/RootLayout'
import Logo from '../components/Logo'

export default function NotFoundPage() {
  return (
    <div className="app">
      <header className="site-header">
        <div className="container">
          <Logo />
        </div>
      </header>
      <main>
        <div className="auth-wrap top">
          <div className="card auth-card center">
            <div className="status-icon">404</div>
            <h1 style={{ marginTop: 8 }}>Halaman tidak ditemukan</h1>
            <p className="lead">Tautan yang Anda buka tidak ada atau sudah dipindahkan.</p>
            <Link to="/" className="btn btn-primary btn-block btn-lg">
              Kembali ke beranda
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
