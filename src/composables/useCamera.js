// ============================================================
// Composable untuk akses kamera (getUserMedia)
// ============================================================
import { ref, onUnmounted } from 'vue'

export function useCamera() {
  const videoRef = ref(null)          // elemen <video>
  const stream = ref(null)           // MediaStream
  const error = ref(null)            // pesan error
  const isActive = ref(false)         // status kamera aktif

  // Mulai kamera (default depan/selfie)
  async function start(facingMode = 'user') {
    error.value = null
    try {
      // Hentikan stream lama jika ada
      if (stream.value) stop()

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      })
      stream.value = mediaStream
      if (videoRef.value) {
        videoRef.value.srcObject = mediaStream
        await videoRef.value.play()
      }
      isActive.value = true
    } catch (e) {
      error.value = 'Kamera tidak dapat diakses: ' + (e.message || e)
      isActive.value = false
    }
  }

  // Hentikan kamera
  function stop() {
    if (stream.value) {
      stream.value.getTracks().forEach((t) => t.stop())
      stream.value = null
    }
    if (videoRef.value) videoRef.value.srcObject = null
    isActive.value = false
  }

  // Ambil snapshot dari video ke canvas -> dataURL (jpeg)
  function capture() {
    if (!videoRef.value || !isActive.value) return null
    const video = videoRef.value
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 480
    const ctx = canvas.getContext('2d')
    // Mirror horizontal agar seperti selfie
    ctx.translate(canvas.width, 0)
    ctx.scale(-1, 1)
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    return canvas.toDataURL('image/jpeg', 0.92)
  }

  onUnmounted(() => stop())

  return { videoRef, stream, error, isActive, start, stop, capture }
}