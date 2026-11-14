// ============================================================
// Composable deteksi tiupan via mikrofon (Web Audio API)
// ============================================================
import { ref } from 'vue'

export function useMicBlow() {
  const isListening = ref(false)
  const error = ref(null)
  let audioContext = null
  let analyser = null
  let micStream = null
  let rafId = null

  // Mulai mendengarkan; panggil onBlow() saat tiupan terdeteksi
  async function start(onBlow, threshold = 0.18, timeoutMs = 8000) {
    error.value = null
    try {
      micStream = await navigator.mediaDevices.getUserMedia({ audio: true })
      audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const source = audioContext.createMediaStreamSource(micStream)
      analyser = audioContext.createAnalyser()
      analyser.fftSize = 1024
      source.connect(analyser)

      const data = new Uint8Array(analyser.frequencyBinCount)
      isListening.value = true

      const startTime = Date.now()
      const check = () => {
        if (!isListening.value) return
        analyser.getByteFrequencyData(data)
        // Hitung rata-rata volume
        let sum = 0
        for (let i = 0; i < data.length; i++) sum += data[i]
        const avg = sum / data.length / 255

        if (avg > threshold) {
          // Tiupan terdeteksi
          stop()
          if (typeof onBlow === 'function') onBlow()
          return
        }
        if (Date.now() - startTime > timeoutMs) {
          // Timeout: hentikan tanpa tiupan
          stop()
          return
        }
        rafId = requestAnimationFrame(check)
      }
      check()
    } catch (e) {
      error.value = 'Mikrofon tidak dapat diakses: ' + (e.message || e)
      isListening.value = false
    }
  }

  function stop() {
    isListening.value = false
    if (rafId) cancelAnimationFrame(rafId)
    rafId = null
    if (micStream) micStream.getTracks().forEach((t) => t.stop())
    micStream = null
    if (audioContext) audioContext.close()
    audioContext = null
  }

  return { isListening, error, start, stop }
}