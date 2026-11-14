// ============================================================
// Pinia store untuk state photobooth (room, role, name, photos)
// ============================================================
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePhotoboothStore = defineStore('photobooth', () => {
  const roomCode = ref(null)
  const role = ref(null)          // 'host' | 'guest'
  const displayName = ref('')
  const photos = ref([])         // dataURL foto yang diambil
  const layout = ref('2-horizontal') // '2-horizontal' | '2x2' | '3x3'
  const timerSeconds = ref(0)     // 0 = tanpa timer
  const customization = ref({
    background: '#FFFFFF',
    borderColor: '#1A1A1A',
    borderWidth: 3,
    radius: 16,
    gap: 8,
    stickerSize: 48,
    stickers: [], // {id, src, x, y, size, rotation}
    title: '',
    footer: '',
  })

  function setRoom(code, roleValue, name) {
    roomCode.value = code
    role.value = roleValue
    displayName.value = name
  }

  function addPhoto(dataUrl) {
    photos.value.push(dataUrl)
  }

  function reset() {
    roomCode.value = null
    role.value = null
    displayName.value = ''
    photos.value = []
    layout.value = '2-horizontal'
    timerSeconds.value = 0
  }

  return { roomCode, role, displayName, photos, layout, timerSeconds, customization, setRoom, addPhoto, reset }
})