import { Outlet, NavLink, Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Ticket } from "lucide-react"

export default function RootLayout() {
  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive ? "text-slate-900 font-semibold" : "text-slate-500 hover:text-slate-900"
    }`

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Navbar Konsisten */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <Ticket className="h-6 w-6 text-slate-900" />
            <span>Tixoria</span>
          </Link>
          
          <nav className="flex items-center gap-6">
            <NavLink to="/" className={navLinkClass}>Beranda</NavLink>
            <NavLink to="/events" className={navLinkClass}>Daftar Event</NavLink>
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">Masuk</Button>
            <Button size="sm">Daftar</Button>
          </div>
        </div>
      </header>

      {/* Konten Halaman */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer Konsisten */}
      <footer className="border-t bg-white py-6 text-center text-sm text-slate-500">
        <p>© 2026 Tixoria PBL Team. All rights reserved.</p>
      </footer>
    </div>
  )
}