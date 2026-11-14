// ============================================================
// Generator kode ruangan otomatis (gabungan nama + kode acak)
// Contoh hasil: photobooth-andi-A1B2
// ============================================================
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

export function generateRoomCode(name = '') {
  // Bersihkan nama: huruf kecil, spasi -> tanda hubung
  const slug = String(name || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 20)

  // Kode acak 4 karakter
  let rand = ''
  for (let i = 0; i < 4; i++) {
    rand += ALPHABET[Math.floor(Math.random() * ALPHABET.length)]
  }

  const base = slug ? `photobooth-${slug}` : 'photobooth'
  return `${base}-${rand}`
}