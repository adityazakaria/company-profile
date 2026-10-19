# Company Profile — Full-Stack (React + Express + Prisma + PostgreSQL)

Website company profile lengkap dengan CMS admin. Perusahaan contoh: **PT Nusa Karya Teknologi** (fiktif).
Tema: merah marun `#F2295B`, biru dongker `#061B3D`, putih & abu-abu terang `#F5F5F5`. Semua teks berbahasa Indonesia.

## Struktur Project

```
company-profile/
├── docker-compose.yml        # PostgreSQL lokal (opsional)
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/       # migrasi SQL awal
│   │   └── seed.js           # 1 admin, profil perusahaan, 5 produk, 5 berita (+1 draft), 1 pesan
│   ├── src/
│   │   ├── config/           # env (validasi Zod), prisma, logger (Winston)
│   │   ├── middleware/       # auth (JWT cookie), errorHandler, validateRequest, rateLimiter, upload
│   │   ├── validators/       # skema Zod
│   │   ├── controllers/ routes/ utils/
│   │   ├── app.js  server.js
│   ├── uploads/              # gambar upload lokal
│   ├── postman_collection.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/       # ui/ (Button, Card, Input, Modal, Pagination, States…), layout/, admin/
    │   ├── pages/public/     # Home, About, Products, ProductDetail, News, NewsDetail, Contact
    │   ├── pages/admin/      # Login, Dashboard, Company, Products, News, Messages
    │   └── lib/              # api (Axios), queries (TanStack Query), schemas (Zod), auth
    └── .env.example
```

## Prasyarat

- Node.js ≥ 18 dan npm
- PostgreSQL 14+ (atau Docker)

## Menjalankan (development)

### 1. Database

Dengan Docker:

```bash
docker compose up -d
```

Atau gunakan PostgreSQL sendiri dan buat database kosong bernama `company_profile`.

### 2. Backend

```bash
cd backend
cp .env.example .env          # sesuaikan DATABASE_URL & JWT_SECRET
npm install
npx prisma generate
npx prisma migrate deploy     # menerapkan migrasi yang sudah ada
npm run prisma:seed           # mengisi data awal
npm run dev                   # http://localhost:5000
```

> Saat mengubah `schema.prisma`, gunakan `npx prisma migrate dev --name <nama_perubahan>` untuk membuat migrasi baru.
> `npm run db:reset` menghapus seluruh data lalu menjalankan ulang migrasi + seed.

Generate `JWT_SECRET` yang kuat:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

### 3. Frontend

```bash
cd frontend
cp .env.example .env          # biarkan VITE_API_URL kosong saat development
npm install
npm run dev                   # http://localhost:5173
```

Vite mem-proxy `/api` dan `/uploads` ke backend, sehingga cookie JWT bekerja di origin yang sama tanpa konfigurasi CORS tambahan.

### 4. Login Admin

Buka <http://localhost:5173/admin/login>

| Email | Password |
|---|---|
| `admin@company.com` | `admin123` |

> ⚠️ **Wajib ganti password default sebelum production.** Atur `ADMIN_EMAIL` / `ADMIN_PASSWORD` di `.env` sebelum menjalankan seed.

## Halaman

| Publik | Admin (JWT) |
|---|---|
| `/` Beranda | `/admin/login` |
| `/tentang` Sejarah, Visi Misi, Nilai, Tim, Legalitas | `/admin/dashboard` statistik |
| `/produk`, `/produk/:slug` cari, filter kategori, pagination | `/admin/company` profil + stat, nilai, tim, legalitas, sosmed |
| `/berita`, `/berita/:slug` cari, filter kategori, pagination | `/admin/products` CRUD |
| `/kontak` form, info, Google Maps, sosmed | `/admin/news` CRUD (editor HTML + pratinjau) |
| | `/admin/messages` baca, tandai, hapus |

Setiap halaman memiliki state *loading*, *error* (dengan tombol coba lagi), dan *empty*.

## Endpoint API

Semua respons: `{ success, message?, data?, meta?, errors? }`. `[Auth]` = butuh cookie login admin (atau header `Authorization: Bearer <token>`).

| Method | Path | Keterangan |
|---|---|---|
| POST | `/api/auth/login` | Login, set cookie httpOnly |
| POST | `/api/auth/logout` | Hapus cookie |
| GET | `/api/auth/me` | Admin saat ini `[Auth]` |
| GET | `/api/company` | Profil perusahaan |
| PUT | `/api/company` | Ubah profil `[Auth]` |
| GET | `/api/products` | Query: `page, limit, search, category`; `all=true` (admin) menyertakan nonaktif |
| GET | `/api/products/categories` | Daftar kategori + jumlah |
| GET | `/api/products/:slug` | Detail + produk terkait |
| POST/PUT/DELETE | `/api/products[/:id]` | `[Auth]` |
| GET | `/api/news` | Query: `page, limit, search, category`; `all=true` (admin) menyertakan draft |
| GET | `/api/news/categories` | Daftar kategori |
| GET | `/api/news/:slug` | Detail + berita lain |
| POST/PUT/DELETE | `/api/news[/:id]` | `[Auth]` |
| POST | `/api/messages` | Kirim pesan (publik, dibatasi 5/jam/IP) |
| GET | `/api/messages` | `page, limit, search, status=all\|read\|unread` `[Auth]` |
| PATCH | `/api/messages/:id/read` | Body `{ "isRead": true }` `[Auth]` |
| DELETE | `/api/messages/:id` | `[Auth]` |
| POST | `/api/upload` | multipart field `image` → `{ data: { url } }` `[Auth]` |
| GET | `/api/stats` | Statistik dashboard `[Auth]` |
| GET | `/api/health` | Cek status |

**Postman:** impor `backend/postman_collection.json`, jalankan *Auth → Login* terlebih dahulu (cookie tersimpan otomatis).

### Catatan skema

Skema mengikuti spesifikasi. Ada penambahan kolom opsional pada `Company` agar halaman Tentang/Beranda/Kontak bisa dikelola dari CMS:
`heroImageUrl, aboutImageUrl, foundedYear, operatingHours, mapEmbedUrl, stats, coreValues, team, legality, socials` (JSON). Harga produk (`price`) bertipe `Int` dalam Rupiah.

## Keamanan

- Password di-hash **bcrypt** (12 rounds di seed; verifikasi tetap konstan-waktu untuk mencegah user enumeration).
- JWT disimpan di **cookie httpOnly** (`SameSite=Lax`, `Secure` saat `COOKIE_SECURE=true`) — tidak terjangkau JavaScript.
- Validasi input di frontend (Zod + React Hook Form) **dan** backend (Zod via middleware `validateRequest`).
- Sanitasi HTML: **sanitize-html** di backend (saat simpan) + **DOMPurify** di frontend (saat tampil). Input teks biasa dibersihkan dari tag.
- **Helmet**, **CORS whitelist** (`CORS_ORIGINS`), body limit 1 MB, upload dibatasi tipe & ukuran.
- **Rate limiting**: umum (`/api`), login (10 gagal/15 mnt), form kontak (5/jam). Honeypot anti-bot di form kontak.
- Logging: **Morgan** → **Winston** (`backend/logs/`).
- Semua secret lewat environment variable; server menolak start bila `.env` tidak valid.

## Upload Gambar

- Default: disimpan di `backend/uploads` dan disajikan di `/uploads/*`.
- Cloudinary: isi `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — otomatis aktif.
- Gambar seed memakai `picsum.photos` (butuh internet); bila gagal dimuat, frontend menampilkan placeholder lokal.

## Deploy (production)

1. **Database**: PostgreSQL terkelola; set `DATABASE_URL`.
2. **Backend**: `NODE_ENV=production`, `JWT_SECRET` kuat, `CORS_ORIGINS=https://domainanda.com`, `PUBLIC_API_URL=https://api.domainanda.com`, `COOKIE_SECURE=true`.
   Jalankan `npx prisma migrate deploy && npm start`. Letakkan di belakang HTTPS (nginx/Caddy/PaaS).
3. **Frontend**: `npm run build`, sajikan folder `dist/` sebagai static site dengan fallback SPA ke `index.html`.
   - Satu domain (reverse proxy `/api` & `/uploads` ke backend): biarkan `VITE_API_URL` kosong.
   - Beda domain: set `VITE_API_URL=https://api.domainanda.com/api`, `COOKIE_SAMESITE=none` dan `COOKIE_SECURE=true`.
4. Ganti password admin default.

## Pemecahan Masalah

| Masalah | Solusi |
|---|---|
| `Konfigurasi .env tidak valid` | Lengkapi `.env` (JWT_SECRET ≥ 32 karakter, DATABASE_URL terisi) |
| `P1001 Can't reach database` | Pastikan PostgreSQL berjalan & kredensial di `DATABASE_URL` benar |
| Login berhasil tapi langsung keluar | Pastikan akses lewat `http://localhost:5173` (proxy Vite); cek `CORS_ORIGINS` & pengaturan cookie |
| Gambar upload tidak tampil | Cek `PUBLIC_API_URL` sesuai alamat backend |
| Peta kosong | Isi URL embed Google Maps di Admin → Profil Perusahaan |
