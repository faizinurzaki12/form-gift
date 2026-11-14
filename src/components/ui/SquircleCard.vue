<template>
  <!-- Card squircle reusable (New Brutalism) -->
  <component
    :is="tag"
    class="squircle-card"
    :class="{ 'squircle-card--accent': accent }"
  >
    <slot />
  </component>
</template>

<script setup>
// Props: tag (elemen), accent (warna aksen)
defineProps({
  tag: { type: String, default: 'div' },
  accent: { type: Boolean, default: false },
})
</script>

<style scoped>
.squircle-card {
  background-color: #FFFFFF;
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--radius-squircle);
  box-shadow: var(--shadow-brutal);
  padding: var(--space-6);
  /* corner-shape squircle dengan fallback border-radius */
  corner-shape: squircle;
}

.squircle-card--accent {
  background-color: var(--color-yellow);
}
</style>