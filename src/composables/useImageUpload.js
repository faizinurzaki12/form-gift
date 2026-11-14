// ============================================================
// Composable upload gambar ke Supabase Storage (fallback dataURL)
// ============================================================
import { ref } from 'vue'
import { uploadFile } from '../services/supabase/photobooth.repository.js'
import { getSupabase } from '../services/supabase/client.js'

export function useImageUpload(bucket = 'gift-images') {
  const uploading = ref(false)
  const error = ref(null)

  async function upload(file) {
    error.value = null
    if (!file) return null
    uploading.value = true
    try {
      const supabase = getSupabase()
      if (supabase) {
        const path = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`
        const url = await uploadFile(bucket, path, file)
        return url
      }
      // Fallback: data URL (tersimpan di DB sebagai teks panjang)
      return await fileToDataUrl(file)
    } catch (e) {
      error.value = e.message || 'Gagal upload gambar.'
      return await fileToDataUrl(file)
    } finally {
      uploading.value = false
    }
  }

  function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  return { uploading, error, upload }
}