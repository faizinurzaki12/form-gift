// ============================================================
// Composable untuk menyalin teks ke clipboard
// ============================================================
import { ref } from 'vue'

export function useClipboard() {
  const copied = ref(false)

  async function copy(text) {
    try {
      await navigator.clipboard.writeText(text)
      copied.value = true
      setTimeout(() => (copied.value = false), 2000)
      return true
    } catch (e) {
      copied.value = false
      return false
    }
  }

  return { copied, copy }
}