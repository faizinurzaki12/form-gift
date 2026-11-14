// ============================================================
// Helper Realtime Supabase (channel per kode ruangan)
// ============================================================
import { getSupabase } from './client.js'

// Buat channel untuk room tertentu
export function createRoomChannel(code) {
  const supabase = getSupabase()
  if (!supabase) return null
  return supabase.channel(`photobooth:${code}`, {
    config: { presence: { key: code } },
  })
}

// Broadcast event ke channel
export function broadcast(channel, event, payload) {
  if (!channel) return
  channel.send({ type: 'broadcast', event, payload })
}