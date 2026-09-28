# Perubahan Frontend untuk Beranda TIXORA

## Yang ditambahkan/diubah dari repo asli

1. **`src/main.css`** — CSS tema galaksi dari desain HTML awal digabungkan di bagian
   bawah file (setelah setup Tailwind/shadcn bawaan). Font "Unbounded" & "Plus Jakarta
   Sans" ditambahkan lewat Google Fonts. **Efek sampingnya**: karena `body` sekarang
   bertema gelap secara global, halaman `/events` dan `/events/:id` (masih pakai
   shadcn terang/`slate-*`) akan terlihat tidak serasi sampai kamu redesain juga —
   ini sudah diduga sesuai rencana kamu ("nanti").
2. **File baru:**
   - `src/lib/api.js` — fetch wrapper ke backend Express (pakai `VITE_API_URL`).
   - `src/lib/categoryIcons.js` — pemetaan slug kategori → ikon `lucide-react`.
   - `src/components/Starfield.jsx` — dekorasi bintang latar belakang.
   - `src/components/EventCard.jsx` — kartu event untuk grid, link ke `/events/:id`.
   - `.env.example` — isi `VITE_API_URL=http://localhost:8000/api`.
3. **`src/Layouts/RootLayout.jsx`** — ditulis ulang total: header/footer bergaya
   TIXORA (logo, nav, search pill, tombol Masuk/Daftar). Search & filter kategori
   disinkronkan lewat URL query params (`?q=...&category=...`) supaya header dan
   halaman Beranda bisa saling terhubung tanpa harus lift state manual.
4. **`src/Pages/HomePage.jsx`** — ditulis ulang total jadi halaman Beranda penuh:
   hero, event terdekat, filter kategori + grid event, trending, event berakhir —
   semua datanya diambil dari backend lewat TanStack Query (bukan data dummy lagi).
5. Halaman **`EventPage.jsx`, `EventDetailPage.jsx`, `NotFoundPage.jsx` sengaja
   tidak disentuh** — masih pakai `MOCK_EVENTS` & tema shadcn lama, sesuai
   kesepakatan untuk dikerjakan menyusul.

## Cara menjalankan

```bash
npm install
cp .env.example .env
npm run dev
```

Pastikan backend (`PBL_Tixoria_BE`) juga jalan di port yang sama dengan `VITE_API_URL`
(default `http://localhost:8000/api`), dan sudah di-migrate + di-seed — kalau tidak,
Beranda akan menampilkan pesan "Gagal memuat event."

## Belum dikerjakan (menyusul sesuai kesepakatan)

- Restyle `/events` dan `/events/:id` ke tema galaksi + data asli dari API
  (`api.getEvents()` di `src/lib/api.js` sudah bisa langsung dipakai di sana).
- Halaman login/register (tombol Masuk/Daftar di header sudah diarahkan ke
  `/login` dan `/register`, tapi route-nya belum didaftarkan di `src/lib/router.jsx`).
- Halaman "Tiket gelang" (pemesanan tiket) dan "Biaya".
