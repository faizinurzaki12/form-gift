# Agent.md — Birthday Surprise (Rencana & Arsitektur)

> Dokumen ini adalah rencana final proyek "Birthday Surprise". Saat implementasi, salin/adaptasi menjadi `Agent.md` di root proyek.

## 1. Judul & Deskripsi
- **Judul:** Birthday Surprise
- **Deskripsi:** Website hadiah ulang tahun ala "gift link": pengguna memilih jenis hadiah, mempersonalisasi (pesan, nama, foto, musik), lalu mendapat link unik untuk dibagikan. Penerima membuka link dan melihat pengalaman surprise. Plus fitur Photobooth real-time berbasis kode ruangan.
- **Inspirasi alur:** gifft.me (hanya alur, bukan style/warna/font — desain original).

## 2. Fitur
1. Ucapan ke sahabat
2. Ucapan ke pacar
3. Surat cinta
4. Kue ulang tahun (tiup lilin via mic/tap + musik YouTube)
5. Photobooth (kode ruangan, layout pilihan: 2 foto berdampingan / 2x2 / 3x3, custom editor)

## 3. Tech Stack
- Runtime: Bun 1.4
- Framework: Vue 3.5 (Composition API, `<script setup>`, JavaScript murni)
- Build: Vite
- State: Pinia | Routing: Vue Router 4
- Backend: Supabase (Postgres + Storage + Realtime)
- Util: `html-to-image` (export strip), YouTube IFrame API + YouTube Data API v3 (opsional)

## 4. Desain (original, New Brutalism + Squircle)
- Border 3–4px solid hitam, shadow hard offset `4px 4px 0 #000` (tanpa blur).
- Palet original: cream `#FFF7EC`, kuning `#FFD93D`, pink `#FF6B9D`, biru `#4D96FF`, hijau `#6BCB77`, hitam `#1A1A1A`.
- Font: Space Grotesk / Archivo Black (Google Fonts) — bukan font gifft.me.
- Squircle: `border-radius: 18px–28px` (+ `corner-shape: squircle` dengan fallback).
- Token di `src/styles/tokens.css`; utilities di `src/styles/brutalism.css`. Semua CSS dengan komentar.

## 5. Struktur Folder (senior Vue.js)
```
D:\birthday/
├── public/
├── sql/
│   └── schema.sql
├── src/
│   ├── app/                      # App.vue, main.js
│   ├── router/index.js
│   ├── stores/                   # Pinia stores
│   ├── services/
│   │   └── supabase/             # client, repositories, realtime
│   ├── composables/              # useCamera, useMicBlow, useRoomCode, useYouTubeSearch, ...
│   ├── components/
│   │   ├── ui/                   # SquircleCard, BrutalButton, BrutalInput, BrutalBadge, BrutalModal
│   │   ├── gift/
│   │   ├── cake/
│   │   ├── letter/
│   │   ├── photobooth/
│   │   └── stickers/
│   ├── features/
│   │   ├── home/
│   │   ├── create/
│   │   ├── gift-view/
│   │   ├── my-gifts/
│   │   └── photobooth/
│   ├── types/                    # JSDoc typedefs (opsional)
│   ├── utils/                    # helper murni
│   └── styles/                   # tokens.css, base.css, brutalism.css
├── .env.example
├── Agent.md
└── README.md
```

Prinsip: pemisahan UI (components), logic (composables), data (services/repositories), halaman (features). Setiap fungsi penting + baris kritis diberi komentar Bahasa Indonesia yang mudah dipahami.

## 6. Routing
- `/` — Beranda (pilih jenis hadiah)
- `/create/:type` — Form pembuatan hadiah
- `/gift/:id` — Halaman penerima (surprise experience)
- `/my-gifts` — Daftar hadiah (dari localStorage)
- `/photobooth` — Lobby (buat/join room)
- `/photobooth/room/:code` — Ruangan photobooth

## 7. Skema Database (Supabase) — `sql/schema.sql`
Tabel:
- **gifts**: id (uuid pk), type, recipient_name, sender_name, title, message, image_url, cake_config (jsonb incl. youtube_video_id), metadata (jsonb), created_at
- **photobooth_rooms**: code (text pk), host_name, status, created_at, expires_at (7 hari)
- **photobooth_participants**: id, room_code (fk), display_name, role, joined_at
- **photobooth_photos**: id, room_code (fk), storage_path, public_url, taken_by, created_at
- **photobooth_strips**: id, room_code (fk), storage_path, public_url, customization (jsonb), created_at

Buckets: `gift-images`, `photobooth` (public read). RLS: anon insert/select (tanpa login). Auto-cleanup 7 hari via `pg_cron` + function + client lazy cleanup.

## 8. Environment (`.env.example`)
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_YOUTUBE_API_KEY=   # opsional, untuk pencarian lagu
```

## 9. Workflow: Pembuatan & Pembukaan Hadiah
1. Beranda: pengguna pilih jenis hadiah (5 pilihan).
2. Form `/create/:type`: isi nama penerima/pengirim, pesan, (opsional) foto, konfigurasi khusus.
3. Submit → insert ke tabel `gifts` → dapat id → tampilkan link `/gift/:id` + tombol salin.
4. Penerima buka link → tampil animasi surprise sesuai jenis → pesan + (jika kue) tiup lilin & musik.

## 10. Workflow: Kue Ulang Tahun + Musik
1. Form: nama penerima/pengirim, pesan, jumlah lilin (3–10), gaya kue, pencarian lagu YouTube (via Data API v3 jika key tersedia; fallback paste link/ID).
2. View: render kue (SVG/CSS) + lilin menyala; tombol "Tiup Lilin" → minta izin mikrofon → Web Audio API deteksi tiupan → padamkan lilin (animasi); fallback tap/klik.
3. Setelah padam → tampilkan pesan + confetti + putar musik YouTube (IFrame; mulai setelah interaksi user karena autoplay policy).

## 11. Workflow: Photobooth (kode ruangan, online 2 orang)
1. Host isi nama → sistem generate kode 6 char acak → insert `photobooth_rooms` → masuk `/photobooth/room/:code` sebagai host.
2. Guest input kode + nama → validasi room → join channel Realtime → masuk room.
3. Keduanya lihat preview kamera (depan default). Sebelum mengambil foto, bisa atur timer countdown: **3 detik / 5 detik / 10 detik** (atau tanpa timer). Ambil foto → jumlah foto sesuai layout yang dipilih; layout pilihan: **2 foto berdampingan**, **grid 2x2 (4 foto)**, atau **grid 3x3 (9 foto)**.
4. Setelah ≥3/4 foto → masuk Editor Custom:
   - Layout (2 foto berdampingan / 2x2 / 3x3)
   - Background (warna/pattern)
   - Border (warna, tebal, radius)
   - Gap, radius foto
   - Teks (judul/footer, ukuran, warna)
   - Stiker (ikon SVG bawaan: boneka & hewan lucu) — bisa tambah banyak, drag/resize/rotate
5. Simpan strip → upload PNG ke Storage + insert `photobooth_strips` → dapat link unik + bisa download.
6. Auto-hapus setelah 7 hari (pg_cron + client lazy cleanup).

Realtime: channel per kode ruangan (presence + broadcast foto baru).

## 12. YouTube API Key
- Pengguna membuat API key di Google Cloud Console (YouTube Data API v3) dan isi `VITE_YOUTUBE_API_KEY`.
- Jika key kosong, fitur pencarian dinonaktifkan; user tetap bisa paste link/ID YouTube (fallback).
- Key client-side: batasi HTTP referrer di Google Cloud.

## 13. Komentar & Keterbacaan
- Setiap fungsi penting + baris kritis diberi komentar Bahasa Indonesia yang mudah dipahami.
- CSS dengan komentar per blok.
- Penamaan jelas (camelCase variabel, PascalCase komponen).

## 14. Deliverables Saat Implementasi
- Scaffold proyek Vue + Vite (Bun).
- Semua file source (JavaScript murni).
- `sql/schema.sql` (lengkap dengan RLS, policies, pg_cron cleanup).
- `Agent.md` (salinan dokumen ini di root proyek).

## 15. Catatan Implementasi
- Autoplay musik: mulai setelah interaksi user (kebijakan browser).
- Kamera: minta izin; fallback pesan jika ditolak.
- Mikrofon: fallback tap jika tidak tersedia/ditolak.
- Storage cleanup: best-effort client + pg_cron server.
- Tanpa login: data diakses via link/kode.

---
Status: Plan final. Siap implementasi setelah switch ke mode build.

## Git

- Init Git
- File dan folder yang tidak perlu dan secret masukkan kedaftar .gitignore
- Setelah selesai semua tugas, commit ke branch main
- Setiap commit harus dalam bahasa indonesia dengan format:
  - awalan *Fix* untuk perbaikan bug
  - awalan *Feat* untuk penambahan atau perubahan fitur

## Larangan
- Jangan lakukan git push tanpa konfirmasi
- Jangan lakukan commit file dan folder secret/penting atau yang tidak perlu

## Rules/Aturan

- Setiap perubahan commit tulis pada CHANGELOG.md dengan format nomor versi - tanggal dan daftar perubahan/commit dibawahnya
- CHANGELOG.md harus dalam bahasa indonesia
