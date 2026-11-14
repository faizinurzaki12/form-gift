<template>
  <section class="page-container">
    <BrutalButton variant="ghost" @click="$router.back()" style="margin-bottom:12px;">← Kembali</BrutalButton>
    <h1>Hadiah Saya</h1>
    <p class="subtitle">Daftar hadiah yang pernah kamu buat di perangkat ini.</p>

    <div v-if="loading" class="squircle-card">Memuat...</div>
    <div v-else-if="!gifts.length" class="squircle-card">
      <p>Belum ada hadiah. <router-link to="/">Buat sekarang</router-link></p>
    </div>
    <div v-else class="grid grid-2">
      <SquircleCard v-for="g in gifts" :key="g.id">
        <h3>{{ g.title || g.type }}</h3>
        <p class="gift-meta">Untuk: {{ g.recipient_name || '-' }}</p>
        <p class="gift-meta">Dari: {{ g.sender_name || '-' }}</p>
        <router-link :to="`/gift/${g.id}`" class="brutal-btn" style="margin-top:8px;">Buka</router-link>
      </SquircleCard>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import SquircleCard from '../../components/ui/SquircleCard.vue'
import BrutalButton from '../../components/ui/BrutalButton.vue'
import { getGiftsByIds } from '../../services/supabase/gifts.repository.js'

const gifts = ref([])
const loading = ref(true)

function getMyGiftIds() {
  try {
    return JSON.parse(localStorage.getItem('birthday:myGifts') || '[]')
  } catch (e) {
    return []
  }
}

onMounted(async () => {
  const ids = getMyGiftIds()
  // Ambil dari Supabase; fallback lokal untuk id "local-"
  const remoteIds = ids.filter((id) => !String(id).startsWith('local-'))
  let result = []
  try {
    result = await getGiftsByIds(remoteIds)
  } catch (e) {
    result = []
  }
  // Tambahkan lokal
  const localGifts = ids
    .filter((id) => String(id).startsWith('local-'))
    .map((id) => {
      try { return JSON.parse(localStorage.getItem('birthday:gift:' + id)) } catch (e) { return null }
    })
    .filter(Boolean)
  gifts.value = [...localGifts, ...result]
  loading.value = false
})
</script>

<style scoped>
.subtitle { opacity: 0.7; margin-bottom: var(--space-6); }
.gift-meta { font-size: 0.9rem; opacity: 0.8; }
</style>