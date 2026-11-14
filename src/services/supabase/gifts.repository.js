// ============================================================
// Repository untuk tabel "gifts"
// ============================================================
import { getSupabase } from './client.js'

// Tipe hadiah yang didukung
export const GIFT_TYPES = {
  FRIEND: 'friend-greeting',
  LOVER: 'lover-greeting',
  LOVE_LETTER: 'love-letter',
  CAKE: 'birthday-cake',
}

// Buat hadiah baru, kembalikan record (termasuk id)
export async function createGift(payload) {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase belum terhubung.')

  const { data, error } = await supabase
    .from('gifts')
    .insert(payload)
    .select()
    .single()

  if (error) throw error
  return data
}

// Ambil hadiah berdasarkan id
export async function getGiftById(id) {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase belum terhubung.')

  const { data, error } = await supabase
    .from('gifts')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) throw error
  return data
}

// Daftar hadiah (untuk "Hadiah Saya" via localStorage ids)
export async function getGiftsByIds(ids) {
  const supabase = getSupabase()
  if (!supabase || !ids?.length) return []

  const { data, error } = await supabase
    .from('gifts')
    .select('*')
    .in('id', ids)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}