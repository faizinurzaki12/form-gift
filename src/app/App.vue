<template>
  <!-- Shell utama aplikasi: navbar + router-view -->
  <div class="app-shell">
    <!-- Latar animasi p5.js (UX) -->
    <div ref="bgRef" class="app-bg"></div>

    <header class="app-header">
      <router-link to="/" class="app-logo">🎂 Birthday Surprise</router-link>
      <nav class="app-nav">
        <router-link to="/my-gifts" class="app-nav__link">Hadiah Saya</router-link>
        <router-link to="/photobooth" class="app-nav__link">Photobooth</router-link>
      </nav>
    </header>

    <main class="app-main">
      <router-view />
    </main>

    <footer class="app-footer">
      <p>Dibuat dengan cinta ❤️ — Birthday Surprise</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const bgRef = ref(null)
let p5Instance = null

onMounted(() => {
  // Inisialisasi animasi p5.js bila library tersedia
  if (typeof window !== 'undefined' && window.p5 && bgRef.value) {
    const sketch = (p) => {
      const particles = []
      p.setup = () => {
        const canvas = p.createCanvas(window.innerWidth, window.innerHeight)
        canvas.parent(bgRef.value)
        for (let i = 0; i < 40; i++) {
          particles.push({
            x: p.random(p.width),
            y: p.random(p.height),
            r: p.random(6, 16),
            vx: p.random(-0.8, 0.8),
            vy: p.random(-0.8, 0.8),
            c: p.color(p.random(200, 255), p.random(100, 200), p.random(150, 255), 140),
          })
        }
      }
      p.draw = () => {
        p.clear()
        particles.forEach((pt) => {
          pt.x += pt.vx
          pt.y += pt.vy
          if (pt.x < 0 || pt.x > p.width) pt.vx *= -1
          if (pt.y < 0 || pt.y > p.height) pt.vy *= -1
          p.noStroke()
          p.fill(pt.c)
          p.circle(pt.x, pt.y, pt.r * 2)
        })
      }
      p.windowResized = () => {
        p.resizeCanvas(window.innerWidth, window.innerHeight)
      }
    }
    p5Instance = new window.p5(sketch)
  }
})

onUnmounted(() => {
  if (p5Instance) p5Instance.remove()
})
</script>

<style scoped>
.app-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.45;
}

.app-shell {
  position: relative;
  z-index: 1;
}
</style>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--space-6);
  border-bottom: var(--border-width) solid var(--color-border);
  background-color: var(--color-yellow);
  box-shadow: var(--shadow-brutal-sm);
}

.app-logo {
  font-family: var(--font-display);
  font-size: 1.25rem;
  color: var(--color-ink);
}

.app-nav {
  display: flex;
  gap: var(--space-4);
}

.app-nav__link {
  font-family: var(--font-display);
  padding: 6px 12px;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-squircle);
  background-color: #FFFFFF;
  box-shadow: var(--shadow-brutal-sm);
}

.app-main {
  flex: 1;
}

.app-footer {
  text-align: center;
  padding: var(--space-4);
  border-top: var(--border-width) solid var(--color-border);
  font-size: 0.85rem;
}
</style>