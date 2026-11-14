// ============================================================
// Composable pencarian lagu via YouTube Data API v3
// ============================================================
import { ref } from 'vue'

export function useYouTubeSearch() {
  const results = ref([])
  const loading = ref(false)
  const error = ref(null)

  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY

  // Cari video musik berdasarkan kata kunci
  async function search(query) {
    error.value = null
    results.value = []
    if (!query?.trim()) return

    if (!apiKey) {
      error.value = 'YouTube API key belum diisi (VITE_YOUTUBE_API_KEY). Gunakan paste link sebagai gantinya.'
      return
    }

    loading.value = true
    try {
      const url = new URL('https://www.googleapis.com/youtube/v3/search')
      url.searchParams.set('part', 'snippet')
      url.searchParams.set('q', query)
      url.searchParams.set('type', 'video')
      url.searchParams.set('videoCategoryId', '10') // Musik
      url.searchParams.set('maxResults', '8')
      url.searchParams.set('key', apiKey)

      const res = await fetch(url.toString())
      if (!res.ok) throw new Error('Gagal mencari: ' + res.status)
      const json = await res.json()

      results.value = (json.items || []).map((item) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        channel: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url,
      }))
    } catch (e) {
      error.value = e.message || 'Terjadi kesalahan pencarian.'
    } finally {
      loading.value = false
    }
  }

  // Ekstrak video ID dari URL YouTube
  function extractVideoId(input) {
    if (!input) return null
    const trimmed = input.trim()
    // Jika sudah ID (11 char)
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed
    // Pola umum URL
    const patterns = [
      /youtu\.be\/([a-zA-Z0-9_-]{11})/,
      /v=([a-zA-Z0-9_-]{11})/,
      /embed\/([a-zA-Z0-9_-]{11})/,
      /shorts\/([a-zA-Z0-9_-]{11})/,
    ]
    for (const p of patterns) {
      const m = trimmed.match(p)
      if (m) return m[1]
    }
    return null
  }

  return { results, loading, error, search, extractVideoId, hasApiKey: !!apiKey }
}