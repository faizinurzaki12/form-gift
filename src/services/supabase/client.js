// ============================================================
// Supabase client
// Koneksi dibaca dari environment Vite (.env)
// ============================================================
import { createClient } from '@supabase/supabase-js'

// Baca variabel lingkungan (Vite mengekspos yang diawali VITE_)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Jika env belum diisi, buat client dummy agar app tidak crash;
// fitur yang butuh Supabase akan menampilkan pesan.
let supabase = null
if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
} else {
  // eslint-disable-next-line no-console
  console.warn('[Supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY belum diisi. Fitur simpan data dinonaktifkan.')
}

export function getSupabase() {
  return supabase
}

export function isSupabaseReady() {
  return !!supabase
}

export default supabase