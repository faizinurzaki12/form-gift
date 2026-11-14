<template>
  <!-- Kartu pilihan jenis hadiah -->
  <router-link :to="to" class="gift-type-card squircle-card" :style="{ backgroundColor: color }">
    <div class="gift-type-card__icon">{{ icon }}</div>
    <h3 class="gift-type-card__title">{{ title }}</h3>
    <p class="gift-type-card__desc">{{ description }}</p>
  </router-link>
</template>

<script setup>
defineProps({
  icon: { type: String, default: '🎁' },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  color: { type: String, default: 'var(--color-yellow)' },
  to: { type: String, required: true },
})
</script>

<style scoped>
.gift-type-card {
  display: block;
  text-decoration: none;
  color: var(--color-ink);
  text-align: center;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.gift-type-card:hover {
  transform: translate(-3px, -3px);
  box-shadow: 7px 7px 0 0 var(--color-ink);
}

.gift-type-card__icon {
  font-size: 2.5rem;
  margin-bottom: var(--space-3);
}

.gift-type-card__title {
  font-size: 1.2rem;
  margin-bottom: var(--space-2);
}

.gift-type-card__desc {
  font-size: 0.9rem;
  opacity: 0.85;
}
</style>