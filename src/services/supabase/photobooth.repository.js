// ============================================================
// Repository untuk photobooth (rooms, participants, photos, strips)
// ============================================================
import { getSupabase } from './client.js'

// Buat room baru dengan kode acak
export async function createRoom(code, hostName, mode = 'single') {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase belum terhubung.')

  // Coba insert dengan kolom mode. Jika kolom belum ada di DB (schema lama),
  // ulangi tanpa mode agar tidak gagal total.
  let result = await supabase
    .from('photobooth_rooms')
    .insert({ code, host_name: hostName, mode, status: 'waiting' })
    .select()
    .single()

  if (result.error && /mode/i.test(result.error.message || '')) {
    result = await supabase
      .from('photobooth_rooms')
      .insert({ code, host_name: hostName, status: 'waiting' })
      .select()
      .single()
  }

  if (result.error) throw result.error
  return result.data
}

// Ambil room berdasarkan kode
export async function getRoom(code) {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase belum terhubung.')

  // Gunakan maybeSingle agar tidak melempar 406 saat room tidak ditemukan
  const { data, error } = await supabase
    .from('photobooth_rooms')
    .select('*')
    .eq('code', code)
    .maybeSingle()

  if (error) throw error
  return data
}

// Update status room
export async function updateRoomStatus(code, status) {
  const supabase = getSupabase()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('photobooth_rooms')
    .update({ status })
    .eq('code', code)
    .select()
    .single()

  if (error) throw error
  return data
}

// Tambah participant
export async function addParticipant(code, displayName, role) {
  const supabase = getSupabase()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('photobooth_participants')
    .insert({ room_code: code, display_name: displayName, role })
    .select()
    .single()

  if (error) throw error
  return data
}

// Simpan metadata foto
export async function savePhoto(code, storagePath, publicUrl, takenBy) {
  const supabase = getSupabase()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('photobooth_photos')
    .insert({ room_code: code, storage_path: storagePath, public_url: publicUrl, taken_by: takenBy })
    .select()
    .single()

  if (error) throw error
  return data
}

// Simpan strip hasil custom
export async function saveStrip(code, storagePath, publicUrl, customization) {
  const supabase = getSupabase()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('photobooth_strips')
    .insert({ room_code: code, storage_path: storagePath, public_url: publicUrl, customization })
    .select()
    .single()

  if (error) throw error
  return data
}

// Upload file ke bucket Supabase Storage
export async function uploadFile(bucket, path, file) {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase belum terhubung.')

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: true,
  })
  if (error) throw error

  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

// Ambil foto lama untuk cleanup 7 hari (client-side best effort)
export async function deleteExpiredPhotos() {
  const supabase = getSupabase()
  if (!supabase) return

  const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  // Hapus metadata; file storage dibersihkan via pg_cron/SQL di server
  await supabase.from('photobooth_photos').delete().lt('created_at', cutoff)
  await supabase.from('photobooth_strips').delete().lt('created_at', cutoff)
}