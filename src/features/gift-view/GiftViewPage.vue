<template>
  <section class="page-container">
    <BrutalButton variant="ghost" @click="$router.push('/')" style="margin-bottom:12px;">← Kembali</BrutalButton>
    <!-- Latar animasi p5.js (celebration) -->
    <div ref="celebRef" class="celeb-bg"></div>
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
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getGiftById } from '../../services/supabase/gifts.repository.js'
import BirthdayCake from '../../components/cake/BirthdayCake.vue'
import BrutalButton from '../../components/ui/BrutalButton.vue'

const route = useRoute()
const gift = ref(null)
const loading = ref(true)
const error = ref(null)

const accentColor = computed(() => {
  if (gift.value?.type === 'friend-greeting') return 'var(--color-green)'
  if (gift.value?.type === 'lover-greeting') return 'var(--color-pink)'
  return 'var(--color-yellow)'
})

const celebRef = ref(null)
let p5Instance = null

onMounted(() => {
  // Animasi celebration p5.js
  if (typeof window !== 'undefined' && window.p5 && celebRef.value) {
    const sketch = (p) => {
      const confetti = []
      p.setup = () => {
        const c = p.createCanvas(window.innerWidth, 260)
        c.parent(celebRef.value)
        for (let i = 0; i < 60; i++) {
          confetti.push({
            x: p.random(p.width),
            y: p.random(-100, 0),
            r: p.random(4, 8),
            vy: p.random(1, 3),
            c: p.color(p.random(200, 255), p.random(100, 220), p.random(120, 255)),
          })
        }
      }
      p.draw = () => {
        p.clear()
        confetti.forEach((cf) => {
          cf.y += cf.vy
          if (cf.y > p.height) cf.y = p.random(-50, 0)
          p.noStroke()
          p.fill(cf.c)
          p.circle(cf.x, cf.y, cf.r * 2)
        })
      }
      p.windowResized = () => p.resizeCanvas(window.innerWidth, 260)
    }
    p5Instance = new window.p5(sketch)
  }
})

onUnmounted(() => {
  if (p5Instance) p5Instance.remove()
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
  object-fit: contain;
  display: block;
  margin-left: auto;
  margin-right: auto;
}
.error-text { color: var(--color-pink); font-weight: 600; }

.celeb-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 260px;
  z-index: 0;
  pointer-events: none;
  opacity: 0.7;
}

.gift-view {
  position: relative;
  z-index: 1;
}
</style>