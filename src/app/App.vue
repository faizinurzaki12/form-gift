<template>
  <!-- Shell utama aplikasi: navbar + router-view -->
  <div class="app-shell">
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
// Tidak ada logic khusus di shell; navigasi ditangani Vue Router
</script>

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