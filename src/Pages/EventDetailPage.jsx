import { useParams, Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { ArrowLeft, Ticket } from "lucide-react"

export default function EventDetailPage() {
  const { id } = useParams()

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <Button asChild variant="ghost" size="sm" className="mb-6 gap-2">
        <Link to="/events">
          <ArrowLeft className="h-4 w-4" /> Kembali ke Daftar
        </Link>
      </Button>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold mb-2">Detail Event #{id}</h1>
        <p className="text-slate-600 mb-6">
          Halaman ini membaca parameter rute dinamis <code>:id</code> dari URL via hook <code>useParams()</code>.
        </p>

        <Button className="w-full gap-2">
          <Ticket className="h-4 w-4" /> Pesan Tiket Ini Sekarang
        </Button>
      </div>
    </div>
  )
}