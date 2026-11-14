<template>
  <section class="page-container">
    <BrutalButton variant="ghost" @click="goBack" style="margin-bottom:12px;">← Kembali</BrutalButton>
    <div class="room-header">
      <h1>Room: {{ store.roomCode }}</h1>
      <p class="room-meta">Kamu: {{ store.displayName }} ({{ store.role }})</p>
    </div>

    <div v-if="!store.roomCode" class="squircle-card">
      <p>Room tidak ditemukan. <router-link to="/photobooth">Kembali</router-link></p>
    </div>

    <template v-else>
      <!-- Pilih layout -->
      <div class="squircle-card" style="margin-bottom:16px;">
        <h3>Layout Foto</h3>
        <div class="layout-options">
          <button
            v-for="opt in layoutOptions"
            :key="opt.value"
            type="button"
            class="layout-btn"
            :class="{ 'layout-btn--active': store.layout === opt.value }"
            @click="store.layout = opt.value"
            :disabled="store.photos.length > 0"
          >
            {{ opt.label }} ({{ opt.count }} foto)
          </button>
        </div>

        <!-- Timer -->
        <div class="timer-options">
          <span>Timer:</span>
          <button
            v-for="t in [0, 3, 5, 10]"
            :key="t"
            type="button"
            class="timer-btn"
            :class="{ 'timer-btn--active': store.timerSeconds === t }"
            @click="store.timerSeconds = t"
          >
            {{ t === 0 ? 'Tanpa' : t + 's' }}
          </button>
        </div>
      </div>

      <!-- Kamera -->
      <div class="squircle-card camera-card">
        <div class="camera-preview">
          <video ref="videoRef" autoplay playsinline muted class="camera-video"></video>
          <div v-if="countdown > 0" class="countdown-overlay">{{ countdown }}</div>
        </div>
        <p v-if="camera.error" class="error-text">{{ camera.error }}</p>

        <div class="camera-actions">
          <BrutalButton
            @click="handleCapture"
            :disabled="cameraBusy || store.photos.length >= requiredCount"
            variant="danger"
          >
            {{ cameraBusy ? '...' : 'Ambil Foto' }}
          </BrutalButton>
          <span class="photo-progress">Foto: {{ store.photos.length }} / {{ requiredCount }}</span>
        </div>

        <!-- Preview foto yang sudah diambil -->
        <div class="photo-thumbs">
          <img v-for="(p, i) in store.photos" :key="i" :src="p" alt="foto" />
        </div>
      </div>

      <!-- Setelah jumlah terpenuhi -> editor -->
      <div v-if="store.photos.length >= requiredCount" class="squircle-card" style="margin-top:16px;">
        <h3>Foto lengkap! Lanjut custom.</h3>
        <BrutalButton @click="showEditor = true" block>Lanjut ke Editor Custom</BrutalButton>
      </div>

      <!-- Editor custom (muncul setelah foto lengkap) -->
      <StripEditor v-if="showEditor" />

      <!-- Host controls -->
      <div v-if="store.role === 'host'" class="host-controls">
        <BrutalButton variant="secondary" @click="endSession">Akhiri Sesi</BrutalButton>
      </div>
    </template>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import SquircleCard from '../../components/ui/SquircleCard.vue'
import BrutalButton from '../../components/ui/BrutalButton.vue'
import { useCamera } from '../../composables/useCamera.js'
import { usePhotoboothStore } from '../../stores/photobooth.store.js'
import StripEditor from '../../components/photobooth/StripEditor.vue'
import { createRoomChannel, broadcast } from '../../services/supabase/realtime.js'
import { updateRoomStatus } from '../../services/supabase/photobooth.repository.js'

const router = useRouter()
const store = usePhotoboothStore()
const camera = useCamera()
// Alias agar template ref bisa di-bind langsung
const videoRef = camera.videoRef

const cameraBusy = ref(false)
const countdown = ref(0)
const showEditor = ref(false)
let channel = null

const layoutOptions = [
  { value: '2-horizontal', label: '2 Foto Berdampingan', count: 2 },
  { value: '2x2', label: 'Grid 2x2', count: 4 },
  { value: '3x3', label: 'Grid 3x3', count: 9 },
]

const requiredCount = computed(() => {
  const opt = layoutOptions.find((o) => o.value === store.layout)
  return opt ? opt.count : 2
})

onMounted(async () => {
  if (!store.roomCode) {
    router.replace('/photobooth')
    return
  }
  await camera.start('user')

  // Setup realtime channel
  channel = createRoomChannel(store.roomCode)
  if (channel) {
    channel
      .on('broadcast', { event: 'photo' }, ({ payload }) => {
        // Tambahkan foto dari remote jika belum ada
        if (payload?.dataUrl && !store.photos.includes(payload.dataUrl)) {
          store.addPhoto(payload.dataUrl)
        }
      })
      .on('broadcast', { event: 'status' }, ({ payload }) => {
        if (payload?.status === 'closed') {
          alert('Sesi ditutup oleh host.')
          router.replace('/photobooth')
        }
      })
      .subscribe()
  }
})

onUnmounted(() => {
  camera.stop()
  if (channel) channel.unsubscribe()
})

async function handleCapture() {
  if (cameraBusy.value) return
  cameraBusy.value = true
  try {
    // Timer countdown
    const t = store.timerSeconds
    if (t > 0) {
      for (let i = t; i > 0; i--) {
        countdown.value = i
        await new Promise((r) => setTimeout(r, 1000))
      }
      countdown.value = 0
    }
    const dataUrl = camera.capture()
    if (dataUrl) {
      store.addPhoto(dataUrl)
      broadcast(channel, 'photo', { dataUrl, takenBy: store.displayName })
    }
  } finally {
    cameraBusy.value = false
    countdown.value = 0
  }
}

function goBack() {
  camera.stop()
  if (channel) channel.unsubscribe()
  store.reset()
  router.push('/photobooth')
}

async function endSession() {
  try {
    await updateRoomStatus(store.roomCode, 'closed')
  } catch (e) { /* ignore */ }
  broadcast(channel, 'status', { status: 'closed' })
  store.reset()
  router.replace('/photobooth')
}
</script>

<style scoped>
.room-header { margin-bottom: var(--space-4); }
.room-meta { opacity: 0.7; }
.layout-options, .timer-options {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-top: var(--space-3);
}
.layout-btn, .timer-btn {
  padding: 8px 12px;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-squircle);
  background-color: #FFFFFF;
  font-family: var(--font-display);
  cursor: pointer;
}
.layout-btn--active, .timer-btn--active {
  background-color: var(--color-yellow);
}
.layout-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.camera-card { text-align: center; }
.camera-preview {
  position: relative;
  display: inline-block;
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--radius-squircle);
  overflow: hidden;
  box-shadow: var(--shadow-brutal);
  aspect-ratio: 4 / 3;       /* samakan bingkai dengan referensi */
  max-width: 480px;
  width: 100%;
  background-color: #d9d3c8;
}

.camera-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scaleX(-1);
}
.countdown-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 5rem;
  font-family: var(--font-display);
  color: #FFFFFF;
  text-shadow: 4px 4px 0 var(--color-ink);
  background-color: rgba(0,0,0,0.35);
}
.camera-actions {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  justify-content: center;
  margin-top: var(--space-4);
  flex-wrap: wrap;
}
.photo-progress { font-family: var(--font-display); }
.photo-thumbs {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  justify-content: center;
  margin-top: var(--space-4);
}
.photo-thumbs img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border: 2px solid var(--color-border);
  border-radius: 8px;
}
.host-controls { margin-top: var(--space-4); text-align: center; }
.error-text { color: var(--color-pink); font-weight: 600; }
</style>