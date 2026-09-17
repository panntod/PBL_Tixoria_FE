import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { ShieldCheck, Zap, Star, Ticket } from "lucide-react"

export default function HomePage() {
  return (
    <div>
      <section className="container mx-auto flex flex-col items-center justify-center px-4 py-20 text-center">
        <Badge variant="secondary" className="mb-4 gap-1.5 py-1 px-3">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" /> Solusi Tiket PBL Terbaik
        </Badge>
        <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          Akses Tiket Konser & Event Jadi Lebih Gampang
        </h1>
        <p className="mt-4 max-w-xl text-slate-600 sm:text-lg">
          Platform manajemen dan pemesanan tiket terintegrasi untuk berbagai acara kampus dan festival lokal.
        </p>
        <div className="mt-8 flex gap-3">
          <Button asChild size="lg" className="gap-2">
            <Link to="/events">
              Jelajahi Event 
            </Link>
          </Button>
        </div>
      </section>

      <section className="border-t bg-white py-16">
        <div className="container mx-auto px-4 grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <Zap className="h-6 w-6 text-slate-800 mb-2" />
              <CardTitle>Pemesanan Instan</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Reservasi cepat tanpa antre dalam hitungan detik.</CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <ShieldCheck className="h-6 w-6 text-slate-800 mb-2" />
              <CardTitle>Transaksi Aman</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Verifikasi kode QR berlapis untuk menjamin keaslian tiket.</CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Ticket className="h-6 w-6 text-slate-800 mb-2" />
              <CardTitle>Tiket Digital</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Akses barcode langsung dari ponsel tanpa cetak kertas.</CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}