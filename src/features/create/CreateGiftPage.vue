<template>
  <section class="page-container">
    <BrutalButton variant="ghost" @click="$router.push('/')" style="margin-bottom:12px;">← Kembali</BrutalButton>
    <div class="create-header">
      <h1>Buat Hadiah</h1>
      <p class="create-subtitle">{{ subtitle }}</p>
    </div>

    <!-- Jika tipe photobooth, arahkan ke lobby photobooth -->
    <div v-if="type === 'photobooth'" class="squircle-card" style="text-align:center;">
      <p>Photobooth menggunakan kode ruangan.</p>
      <router-link to="/photobooth" class="brutal-btn" style="margin-top:12px; display:inline-flex;">Buka Photobooth</router-link>
    </div>

    <!-- Form sesuai tipe -->
    <div v-else class="squircle-card">
      <component
        :is="formComponent"
        @submit="handleSubmit"
      />
      <p v-if="error" class="error-text">{{ error }}</p>
    </div>

    <!-- Hasil: link berbagi -->
    <div v-if="createdId" class="squircle-card share-result anim-pop">
      <h3>Hadiah siap dibagikan! 🎉</h3>
      <p>Bagikan link ini ke penerima:</p>
      <ShareLink :url="shareUrl" />
      <router-link :to="`/gift/${createdId}`" class="brutal-btn" style="margin-top:12px;">Lihat Hadiah</router-link>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import FriendGreetingForm from './forms/FriendGreetingForm.vue'
import LoverGreetingForm from './forms/LoverGreetingForm.vue'
import LoveLetterForm from './forms/LoveLetterForm.vue'
import BirthdayCakeForm from './forms/BirthdayCakeForm.vue'
import ShareLink from '../../components/gift/ShareLink.vue'
import BrutalButton from '../../components/ui/BrutalButton.vue'
import { createGift } from '../../services/supabase/gifts.repository.js'

const route = useRoute()
const type = computed(() => route.params.type)

const subtitleMap = {
  'friend-greeting': 'Ucapan ke Sahabat',
  'lover-greeting': 'Ucapan ke Pacar',
  'love-letter': 'Surat Cinta',
  'birthday-cake': 'Kue Ulang Tahun',
  'photobooth': 'Photobooth',
}
const subtitle = computed(() => subtitleMap[type.value] || 'Hadiah')

const formMap = {
  'friend-greeting': FriendGreetingForm,
  'lover-greeting': LoverGreetingForm,
  'love-letter': LoveLetterForm,
  'birthday-cake': BirthdayCakeForm,
}
const formComponent = computed(() => formMap[type.value] || null)

// Data form (v-model object)
const formData = ref({})

const createdId = ref(null)
const error = ref(null)

const shareUrl = computed(() => `${window.location.origin}/#/gift/${createdId.value}`)

// Simpan id hadiah ke localStorage (tanpa login)
function saveMyGiftId(id) {
  try {
    const key = 'birthday:myGifts'
    const list = JSON.parse(localStorage.getItem(key) || '[]')
    if (!list.includes(id)) list.unshift(id)
    localStorage.setItem(key, JSON.stringify(list.slice(0, 50)))
  } catch (e) {
    // Abaikan error storage
  }
}

async function handleSubmit(payload) {
  error.value = null
  try {
    const record = await createGift(payload)
    createdId.value = record.id
    saveMyGiftId(record.id)
  } catch (e) {
    // Jika Supabase belum siap, simpan lokal (fallback) agar tetap bisa dilihat
    const localId = 'local-' + Date.now()
    const localData = { id: localId, ...payload, created_at: new Date().toISOString() }
    try {
      localStorage.setItem('birthday:gift:' + localId, JSON.stringify(localData))
    } catch (err) { /* ignore */ }
    createdId.value = localId
    saveMyGiftId(localId)
    error.value = 'Supabase belum terhubung; hadiah disimpan lokal (hanya di perangkat ini).'
  }
}
</script>

<style scoped>
.create-header {
  text-align: center;
  margin-bottom: var(--space-6);
}

.create-subtitle {
  opacity: 0.7;
}

.error-text {
  color: var(--color-pink);
  margin-top: var(--space-3);
  font-weight: 600;
}

.share-result {
  margin-top: var(--space-6);
  text-align: center;
}
</style>