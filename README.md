# Birthday Surprise

Website hadiah ulang tahun (inspirasi alur gifft.me, desain original New Brutalism + Squircle).

## Tech Stack
- Bun (runtime)
- Vue 3.5 (JavaScript murni)
- Vite
- Supabase (Postgres + Storage + Realtime)

## Cara Menjalankan
```bash
bun install
cp .env.example .env
# isi .env dengan URL & anon key Supabase
bun run dev
```

## Setup Supabase
1. Buat project Supabase.
2. Jalankan `sql/schema.sql` di SQL Editor.
3. Isi `.env` dengan `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`.
4. (Opsional) YouTube API key di `VITE_YOUTUBE_API_KEY`.

## Cara Membuat YouTube API Key
1. Buka https://console.cloud.google.com/
2. Buat project baru (atau pilih yang ada).
3. Menu **APIs & Services → Library**, cari **YouTube Data API v3**, klik **Enable**.
4. Menu **APIs & Services → Credentials → Create Credentials → API key**.
5. (Disarankan) Klik **Restrict key**, pilih **HTTP referrers**, masukkan domain website kamu.
6. Salin key ke `.env` sebagai `VITE_YOUTUBE_API_KEY`.

Jika tidak diisi, fitur pencarian lagu dinonaktifkan; pengguna tetap bisa menempel link/ID YouTube.

## Struktur
Lihat `Agent.md`.

<!-- contributor check -->