import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4 bg-slate-50">
      <h1 className="text-7xl font-extrabold text-slate-900">404</h1>
      <p className="mt-2 text-xl font-medium text-slate-600">Halaman tidak ditemukan</p>
      <Button asChild className="mt-6">
        <Link to="/">Kembali ke Beranda</Link>
      </Button>
    </div>
  )
}