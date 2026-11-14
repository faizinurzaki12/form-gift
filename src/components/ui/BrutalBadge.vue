<template>
  <span class="brutal-badge" :style="{ backgroundColor: color }">
    <slot />
  </span>
</template>

<script setup>
defineProps({
  color: { type: String, default: 'var(--color-pink)' },
})
</script>

<style scoped>
.brutal-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  font-size: 0.75rem;
  font-family: var(--font-display);
  color: #FFFFFF;
  border: 2px solid var(--color-border);
  border-radius: 999px;
}
</style>