# TIXORA — Slicing ulang Frontend (role: User)

Tampilan lama (tema galaksi) sudah diganti seluruhnya dengan desain baru (`user.zip`):
tema terang, aksen indigo `#4b34db`, cyan `#5ec8e5`, kuning `#f6b94a`.

## Cara menjalankan
```bash
npm install
cp .env.example .env
npm run dev
```
`VITE_USE_MOCK=true` (default) memakai data contoh sehingga semua halaman bisa dicoba tanpa backend.
Ubah ke `false` untuk memakai backend asli (`/auth/*`, `/categories`, `/events`).

Mode demo: masuk dengan surel apa saja dan kata sandi minimal 8 karakter
(kata sandi lebih pendek menampilkan pesan error seperti di desain).

## Peta halaman (sesuai file desain)
| Desain | Rute | File |
|---|---|---|
| 02 Landing | `/` | `pages/LandingPage.jsx` |
| 03 Jelajah acara | `/events` | `pages/ExplorePage.jsx` |
| 04, 13, 14, 15 Detail acara (akan datang / selesai / dibatalkan / tiket habis) | `/events/:id` | `pages/EventDetailPage.jsx` |
| 05 Masuk | `/login` | `pages/LoginPage.jsx` |
| daftar Buat akun | `/register` | `pages/RegisterPage.jsx` |
| 19, 20 Lupa kata sandi (+ terkirim) | `/forgot-password` | `pages/ForgotPasswordPage.jsx` |
| 06 Pendaftaran | `/events/:id/register` | `pages/RegistrationPage.jsx` |
| 07 Konfirmasi | `/registrations/:orderNo/success` | `pages/ConfirmationPage.jsx` |
| 08 Tiket saya | `/my-tickets` | `pages/MyTicketsPage.jsx` |
| 10 Akun | `/account` | `pages/AccountProfilePage.jsx` |
| 12 Riwayat pendaftaran | `/account/riwayat` | `pages/AccountHistoryPage.jsx` |
| 11 Kondisi antarmuka | komponen: empty, error, skeleton, toast | `components/States.jsx`, `context/ToastContext.jsx` |

## Yang belum ada desainnya (dibuat sederhana, konsisten dengan gaya baru)
- Langkah **Pembayaran** pada wizard pendaftaran (pilih metode, simulasi bayar).
- Halaman **detail tiket** (`/tickets/:orderNo`) dengan QR placeholder, dan halaman **Notifikasi** di Akun.
- QR masih dekoratif (`components/QrCode.jsx`); ganti dengan pustaka QR saat backend siap.

## Catatan integrasi backend
- Auth (`login`, `register`, `me`) tetap memakai `lib/api.js` seperti sebelumnya.
- Belum ada endpoint untuk: detail event lengkap (tiket, rundown), pendaftaran/tiket, lupa & ganti kata sandi,
  update profil, hapus akun. Sementara memakai mock/localStorage (`lib/services.js`, tanda `TODO`).
  `normalizeEvent()` di `services.js` menyesuaikan bentuk data backend ke tampilan baru.
- Rute admin dan owner event ditambahkan nanti; titik pengalihan setelah login ada di `LoginPage.jsx` (`TODO`).
- Halaman lama (Biaya, Tiket gelang, Starfield, komponen shadcn) dihapus karena tidak ada di desain baru.
