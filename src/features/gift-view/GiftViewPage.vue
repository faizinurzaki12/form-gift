<template>
  <section class="page-container">
    <div v-if="loading" class="squircle-card">Memuat hadiah...</div>
    <div v-else-if="error" class="squircle-card">
      <p class="error-text">{{ error }}</p>
    </div>
    <div v-else-if="gift" class="gift-view">
      <!-- Ucapan sahabat / pacar / surat cinta -->
      <div v-if="gift.type === 'friend-greeting' || gift.type === 'lover-greeting'" class="squircle-card greeting-card anim-pop" :style="{ backgroundColor: accentColor }">
        <h1>Hai, {{ gift.recipient_name }}! 🎉</h1>
        <p class="greeting-from">Dari: {{ gift.sender_name }}</p>
        <p class="greeting-message">{{ gift.message }}</p>
        <img v-if="gift.image_url" :src="gift.image_url" alt="Foto" class="greeting-image" />
      </div>

      <div v-else-if="gift.type === 'love-letter'" class="squircle-card letter-card anim-pop">
        <h1>💌 Surat Cinta</h1>
        <p class="letter-to">Untuk: {{ gift.recipient_name }}</p>
        <p class="letter-from">Dari: {{ gift.sender_name }}</p>
        <div class="letter-body">{{ gift.message }}</div>
        <img v-if="gift.image_url" :src="gift.image_url" alt="Foto" class="letter-image" />
      </div>

      <!-- Kue ulang tahun -->
      <BirthdayCake v-else-if="gift.type === 'birthday-cake'" :gift="gift" />

      <div v-else class="squircle-card">
        <p>Jenis hadiah tidak dikenal.</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getGiftById } from '../../services/supabase/gifts.repository.js'
import BirthdayCake from '../../components/cake/BirthdayCake.vue'

const route = useRoute()
const gift = ref(null)
const loading = ref(true)
const error = ref(null)

const accentColor = computed(() => {
  if (gift.value?.type === 'friend-greeting') return 'var(--color-green)'
  if (gift.value?.type === 'lover-greeting') return 'var(--color-pink)'
  return 'var(--color-yellow)'
})

onMounted(async () => {
  const id = route.params.id
  // Coba ambil dari Supabase; jika id lokal, ambil dari localStorage
  if (String(id).startsWith('local-')) {
    try {
      const raw = localStorage.getItem('birthday:gift:' + id)
      if (raw) gift.value = JSON.parse(raw)
      else error.value = 'Hadiah tidak ditemukan.'
    } catch (e) {
      error.value = 'Gagal memuat hadiah.'
    } finally {
      loading.value = false
    }
    return
  }
  try {
    gift.value = await getGiftById(id)
  } catch (e) {
    error.value = 'Hadiah tidak ditemukan atau Supabase belum terhubung.'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.gift-view { max-width: 640px; margin: 0 auto; }
.greeting-card, .letter-card { text-align: center; }
.greeting-from, .letter-to, .letter-from { opacity: 0.8; margin: var(--space-2) 0; }
.greeting-message, .letter-body {
  font-size: 1.1rem;
  margin: var(--space-4) 0;
  white-space: pre-wrap;
}
.greeting-image, .letter-image {
  margin: var(--space-4) auto 0;
  border-radius: var(--radius-squircle);
  border: var(--border-width) solid var(--color-border);
  box-shadow: var(--shadow-brutal);
  max-height: 320px;
  object-fit: cover;
}
.error-text { color: var(--color-pink); font-weight: 600; }
</style>