<template>
  <section class="page-container">
    <BrutalButton variant="ghost" @click="router.push('/')" style="margin-bottom:12px;">← Kembali</BrutalButton>
    <SquircleCard>
      <h1>Masuk Ruangan Photobooth</h1>
      <p class="subtitle">Masukkan kode ruangan yang diberikan host.</p>

      <BrutalInput v-model="joinCode" label="Kode Ruangan" placeholder="photobooth-nama-XXXX" />
      <BrutalInput v-model="guestName" label="Nama Kamu" placeholder="Nama kamu" />

      <BrutalButton @click="join" :loading="joining" block style="margin-top:12px;">Masuk</BrutalButton>
      <p v-if="error" class="error-text">{{ error }}</p>
    </SquircleCard>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import SquircleCard from '../../components/ui/SquircleCard.vue'
import BrutalInput from '../../components/ui/BrutalInput.vue'
import BrutalButton from '../../components/ui/BrutalButton.vue'
import { isValidRoomCode } from '../../utils/validation.js'
import { getRoom, addParticipant } from '../../services/supabase/photobooth.repository.js'
import { usePhotoboothStore } from '../../stores/photobooth.store.js'

const router = useRouter()
const store = usePhotoboothStore()

const joinCode = ref('')
const guestName = ref('')
const joining = ref(false)
const error = ref(null)

async function join() {
  error.value = null
  const code = joinCode.value.trim()
  if (!isValidRoomCode(code)) {
    error.value = 'Kode ruangan tidak valid.'
    return
  }
  if (!guestName.value.trim()) {
    error.value = 'Nama wajib diisi.'
    return
  }
  joining.value = true
  try {
    const room = await getRoom(code)
    if (!room || room.status === 'closed') {
      error.value = 'Ruangan tidak ditemukan atau sudah ditutup.'
      return
    }
    store.setMode(room.mode || 'two')
    await addParticipant(code, guestName.value.trim(), 'guest')
    store.setRoom(code, 'guest', guestName.value.trim())
    store.setMode('two')
    router.push(`/photobooth/room/${code}`)
  } catch (e) {
    error.value = e.message || 'Gagal masuk ruangan.'
  } finally {
    joining.value = false
  }
}
</script>

<style scoped>
.subtitle { opacity: 0.7; margin-bottom: var(--space-4); }
.error-text { color: var(--color-pink); font-weight: 600; margin-top: var(--space-3); }
</style>