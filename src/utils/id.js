// ============================================================
// Generator ID sederhana (fallback jika tidak pakai crypto.randomUUID)
// ============================================================
export function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  // Fallback: kombinasi timestamp + random
  return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10)
}