<template>
  <section class="page-container">
    <BrutalButton variant="ghost" @click="router.push('/')" style="margin-bottom:12px;">← Kembali</BrutalButton>
    <SquircleCard>
      <h1>Buat Ruangan Photobooth</h1>
      <p class="subtitle">Kode ruangan dibuat otomatis, bisa kamu ubah.</p>

      <BrutalInput v-model="hostName" label="Nama Host" placeholder="Nama kamu" />
      <BrutalInput v-model="roomName" label="Nama Ruangan (opsional)" placeholder="Photobooth" />

      <div class="code-row">
        <BrutalInput v-model="roomCode" label="Kode Ruangan" placeholder="photobooth-nama-XXXX" />
        <BrutalButton variant="secondary" @click="regenerate">Generate Ulang</BrutalButton>
      </div>

      <BrutalButton @click="create" :loading="creating" block style="margin-top:12px;">Buat Ruangan</BrutalButton>
      <p v-if="error" class="error-text">{{ error }}</p>
    </SquircleCard>
  </section>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import SquircleCard from '../../components/ui/SquircleCard.vue'
import BrutalInput from '../../components/ui/BrutalInput.vue'
import BrutalButton from '../../components/ui/BrutalButton.vue'
import { generateRoomCode } from '../../utils/roomCode.js'
import { isValidRoomCode } from '../../utils/validation.js'
import { createRoom as createRoomApi } from '../../services/supabase/photobooth.repository.js'
import { usePhotoboothStore } from '../../stores/photobooth.store.js'

const router = useRouter()
const store = usePhotoboothStore()

const hostName = ref('')
const roomName = ref('')
const roomCode = ref(generateRoomCode(''))
const creating = ref(false)
const error = ref(null)

// Regenerate kode saat nama host berubah (sekali)
watch(hostName, (val) => {
  if (!roomCode.value || roomCode.value.endsWith('-XXXX')) {
    roomCode.value = generateRoomCode(val)
  }
}, { immediate: true })

function regenerate() {
  roomCode.value = generateRoomCode(hostName.value)
}

async function create() {
  error.value = null
  if (!hostName.value.trim()) {
    error.value = 'Nama host wajib diisi.'
    return
  }
  const code = roomCode.value.trim()
  if (!isValidRoomCode(code)) {
    error.value = 'Kode ruangan tidak valid.'
    return
  }
  creating.value = true
  try {
    await createRoomApi(code, hostName.value.trim())
    store.setRoom(code, 'host', hostName.value.trim())
    router.push(`/photobooth/room/${code}`)
  } catch (e) {
    error.value = e.message || 'Gagal membuat ruangan (kode mungkin sudah dipakai).'
  } finally {
    creating.value = false
  }
}
</script>

<style scoped>
.subtitle { opacity: 0.7; margin-bottom: var(--space-4); }
.code-row { display: flex; gap: var(--space-2); align-items: end; }
.code-row .brutal-input-wrap { flex: 1; }
.error-text { color: var(--color-pink); font-weight: 600; margin-top: var(--space-3); }
</style>