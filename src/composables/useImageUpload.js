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
      // Kompresi gambar sebelum upload (max 1280px, quality 0.8)
      const compressed = await compressImage(file, 1280, 0.8)
      const supabase = getSupabase()
      if (supabase) {
        const path = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`
        const url = await uploadFile(bucket, path, compressed)
        return url
      }
      // Fallback: data URL (tersimpan di DB sebagai teks panjang)
      return await fileToDataUrl(compressed)
    } catch (e) {
      error.value = e.message || 'Gagal upload gambar.'
      return await fileToDataUrl(file)
    } finally {
      uploading.value = false
    }
  }

  function compressImage(file, maxSize, quality) {
    return new Promise((resolve) => {
      const img = new Image()
      const url = URL.createObjectURL(file)
      img.onload = () => {
        URL.revokeObjectURL(url)
        let { width, height } = img
        if (width > maxSize || height > maxSize) {
          const scale = maxSize / Math.max(width, height)
          width = Math.round(width * scale)
          height = Math.round(height * scale)
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        canvas.toBlob((blob) => {
          if (blob) resolve(new File([blob], file.name, { type: 'image/jpeg' }))
          else resolve(file)
        }, 'image/jpeg', quality)
      }
      img.onerror = () => {
        URL.revokeObjectURL(url)
        resolve(file)
      }
      img.src = url
    })
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