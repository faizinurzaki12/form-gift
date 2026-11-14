# CHANGELOG

## 1.5.1 - 2026-11-14
- Feat: Penambahan halaman Photobooth Sendiri (solo) satu perangkat.
- Feat: Lobby photobooth menampilkan pilihan Sendiri, Buat Ruangan, Masuk Ruangan.
- Feat: Penyimpanan mode room (single/two) pada create/join/store.
- Fix: Penambahan tombol kembali di halaman strip photobooth.
- Docs: Penambahan link pembuatan YouTube API key di .env.example.
- Test: Build dan unit test lulus.

## 1.5.0 - 2026-11-14
- Fix: Bug mode column (fallback + panduan SQL alter table).
- Fix: 404 manifest.webmanifest (tambah manifest + link).
- Feat: Custom photobooth ala beautyplus (frame presets + filter foto).
- Test: Build dan unit test lulus.

## 1.4.0 - 2026-11-14
- Feat: Photobooth 2 type (solo & 2 orang real-time), ref beautyplus & NEAMOR.
- Fix: Back button ke halaman utama.
- Test: Build dan unit test lulus.

## 1.3.0 - 2026-11-14
- Fix: Bug tombol kembali di photobooth (kini ke halaman utama).
- Feat: Waiting room + 2 kamera + WebRTC live preview + capture sinkron.
- Test: Build dan unit test lulus.

## 1.2.0 - 2026-11-14
- Feat: Penyesuaian Photobooth mengikuti referensi (bingkai 4:3, alur room).
- Fix: Penambahan tombol kembali di setiap halaman terkait.
- Test: Build dan unit test lulus.

## 1.1.0 - 2026-11-14
- Feat: Penambahan responsivitas mobile (layout, grid, tombol, form).
- Fix: Penyesuaian bentuk form (squircle) konsisten dengan button.
- Test: Penambahan unit test util room code (lulus).
- Docs: Update CHANGELOG.

## 1.0.0 - 2026-11-14
- Feat: Inisialisasi proyek Birthday Surprise (Vue 3 + Vite + Bun).
- Feat: Implementasi fitur hadiah: ucapan sahabat, ucapan pacar, surat cinta, kue ulang tahun (balon tap + musik YouTube).
- Feat: Implementasi Photobooth berbasis kode ruangan (host/guest, timer, layout 2/2x2/3x3, editor custom).
- Feat: Integrasi Supabase (database, storage, realtime) + skema SQL.
- Fix: Penyesuaian room code otomatis (nama + kode acak) dan pemisahan halaman buat/masuk ruangan.
- Fix: Penghapusan tombol tiup lilin; diganti interaksi tap balon.
- Docs: Penambahan Agent.md, README.md, .env.example.