// ============================================================
// Validasi form sederhana
// ============================================================
export function isNonEmpty(value) {
  return typeof value === 'string' && value.trim().length > 0
}

export function isValidRoomCode(code) {
  // Izinkan slug + kode acak (huruf, angka, tanda hubung)
  return typeof code === 'string' && /^[a-zA-Z0-9-]{4,40}$/.test(code.trim())
}