# Birthday Surprise 🎂

**Birthday Surprise** adalah website untuk membuat hadiah ulang tahun digital yang bisa dibagikan lewat link.
Kamu bisa memilih jenis hadiah, menulis pesan, menambahkan foto, dan bahkan menambahkan musik.
Setelah selesai, kamu mendapat link unik yang bisa dikirim ke teman atau pacar. Saat mereka membuka link, mereka akan melihat kejutan interaktif.

## Fitur Utama
- 🤝 **Ucapan ke Sahabat** — kartu ucapan hangat.
- 💖 **Ucapan ke Pacar** — ucapan manis untuk pasangan.
- 💌 **Surat Cinta** — surat digital dengan foto.
- 🎂 **Kue Ulang Tahun** — kue virtual dengan lilin yang bisa "ditiup" (tap balon) + musik YouTube.
- 📸 **Photobooth** — foto bersama via kode ruangan (solo atau 2 orang real-time).

## Cara Pakai
1. Buka website, pilih jenis hadiah.
2. Isi nama penerima & pengirim, tulis pesan, (opsional) tambah foto/musik.
3. Klik "Kirim" → dapat link berbagi.
4. Bagikan link ke penerima.

## Teknologi
- Bun + Vue 3 + Vite
- Supabase (database, storage, realtime)
- YouTube API (opsional, untuk musik)

## Setup (Developer)
```bash
bun install
cp .env.example .env
# isi .env dengan Supabase URL & anon key
bun run dev
```

## Struktur
Lihat `Agent.md`.

## Lisensi
Open source — bebas digunakan & dimodifikasi.