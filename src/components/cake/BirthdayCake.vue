<template>
  <div class="cake-view squircle-card anim-pop">
    <h1>🎂 Selamat Ulang Tahun, {{ gift.recipient_name }}!</h1>
    <p class="cake-from">Dari: {{ gift.sender_name }}</p>
    <img v-if="gift.image_url" :src="gift.image_url" alt="Foto" class="cake-image" />

    <!-- Balon yang bisa di-tap -->
    <div class="balloons">
      <button
        v-for="(b, i) in balloons"
        :key="i"
        type="button"
        class="balloon"
        :class="{ 'balloon--popped': b.popped }"
        :style="{ left: b.left + '%', backgroundColor: b.color }"
        @click="popBalloon(i)"
        :aria-label="'Balon ' + (i + 1)"
      >
        <span v-if="!b.popped">🎈</span>
      </button>
    </div>

    <!-- Kue dengan lilin -->
    <div class="cake-stage">
      <div class="cake">
        <div class="cake__candles">
          <div
            v-for="i in candleCount"
            :key="i"
            class="candle"
            :class="{ 'candle--out': blown }"
          >
            <div class="flame" v-if="!blown"></div>
          </div>
        </div>
        <div class="cake__top"></div>
        <div class="cake__bottom"></div>
      </div>
    </div>

    <p v-if="!blown" class="cake-hint">Tap semua balon untuk meniup lilin! 🎈</p>
    <p v-else class="cake-message">{{ gift.message }}</p>

    <!-- Musik YouTube (diputar setelah lilin padam) -->
    <div v-if="blown && videoId" class="music-player">
      <iframe
        :src="`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`"
        title="Musik Ulang Tahun"
        frameborder="0"
        allow="autoplay; encrypted-media"
        allowfullscreen
      ></iframe>
    </div>

    <!-- Confetti -->
    <div class="confetti-layer" v-if="blown">
      <div
        v-for="i in 40"
        :key="i"
        class="confetti-piece"
        :style="confettiStyle(i)"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  gift: { type: Object, required: true },
})

const blown = ref(false)

const candleCount = computed(() => props.gift?.cake_config?.candles || 5)
const videoId = computed(() => props.gift?.cake_config?.youtubeVideoId || null)

// Balon yang bisa di-tap
const balloonColors = ['#FF6B9D', '#4D96FF', '#6BCB77', '#FFD93D', '#B388FF']
const balloons = ref(
  Array.from({ length: 5 }, (_, i) => ({
    popped: false,
    left: 8 + i * 18,
    color: balloonColors[i % balloonColors.length],
  }))
)

function popBalloon(i) {
  if (balloons.value[i].popped || blown.value) return
  balloons.value[i].popped = true
  // Jika semua balon sudah di-tap, padamkan lilin
  if (balloons.value.every((b) => b.popped)) {
    blowNow()
  }
}

function blowNow() {
  blown.value = true
}

function confettiStyle(i) {
  const colors = ['#FFD93D', '#FF6B9D', '#4D96FF', '#6BCB77', '#B388FF']
  const left = Math.random() * 100
  const delay = Math.random() * 0.8
  const color = colors[i % colors.length]
  return {
    left: left + 'vw',
    backgroundColor: color,
    animationDelay: delay + 's',
  }
}
</script>

<style scoped>
.cake-view {
  max-width: 640px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.cake-from { opacity: 0.8; margin-bottom: var(--space-4); }

.cake-image {
  max-width: 100%;
  max-height: 220px;
  object-fit: cover;
  border-radius: var(--radius-squircle);
  border: var(--border-width) solid var(--color-border);
  box-shadow: var(--shadow-brutal);
  margin-bottom: var(--space-4);
}

.balloons {
  position: relative;
  height: 90px;
  margin-bottom: var(--space-2);
}

.balloon {
  position: absolute;
  top: 0;
  width: 44px;
  height: 54px;
  border: 2px solid var(--color-border);
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  font-size: 1.4rem;
  cursor: pointer;
  transition: transform var(--transition-fast), opacity var(--transition-fast);
  box-shadow: var(--shadow-brutal-sm);
}

.balloon:hover { transform: scale(1.1); }
.balloon--popped {
  opacity: 0;
  transform: scale(0);
  pointer-events: none;
}

.cake-stage {
  display: flex;
  justify-content: center;
  margin: var(--space-6) 0;
}

.cake {
  position: relative;
  width: 240px;
}

.cake__candles {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 4px;
}

.candle {
  width: 8px;
  height: 34px;
  background: linear-gradient(#FFFFFF, #FFD93D);
  border: 2px solid var(--color-ink);
  border-radius: 4px;
  position: relative;
}

.flame {
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  width: 10px;
  height: 14px;
  background: radial-gradient(circle at 50% 60%, #FFD93D, #FF6B35);
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  animation: flicker 0.15s infinite alternate;
}

@keyframes flicker {
  from { transform: translateX(-50%) scale(1); }
  to { transform: translateX(-50%) scale(1.15); }
}

.candle--out .flame { display: none; }

.cake__top {
  height: 30px;
  background-color: var(--color-pink);
  border: var(--border-width) solid var(--color-border);
  border-radius: 120px 120px 0 0;
}

.cake__bottom {
  height: 60px;
  background-color: var(--color-yellow);
  border: var(--border-width) solid var(--color-border);
  border-radius: 0 0 16px 16px;
}

.cake-hint { opacity: 0.7; margin: var(--space-3) 0; }
.cake-message {
  font-size: 1.1rem;
  margin: var(--space-4) 0;
  white-space: pre-wrap;
}

.music-player {
  margin-top: var(--space-6);
}

.music-player iframe {
  width: 100%;
  max-width: 480px;
  height: 200px;
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--radius-squircle);
  box-shadow: var(--shadow-brutal);
}

.confetti-layer {
  pointer-events: none;
}
</style>