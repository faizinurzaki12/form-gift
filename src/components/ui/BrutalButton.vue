<template>
  <button
    class="brutal-button"
    :class="[`brutal-button--${variant}`, { 'brutal-button--block': block }]"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="brutal-button__spinner" aria-hidden="true"></span>
    <slot />
  </button>
</template>

<script setup>
defineProps({
  variant: { type: String, default: 'primary' }, // primary | secondary | danger | ghost
  block: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
})

defineEmits(['click'])
</script>

<style scoped>
.brutal-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: 12px 20px;
  font-family: var(--font-display);
  font-size: 1rem;
  color: var(--color-ink);
  background-color: var(--color-yellow);
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--radius-squircle);
  box-shadow: var(--shadow-brutal-sm);
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
  cursor: pointer;
}

.brutal-button:hover:not(:disabled) {
  transform: translate(-2px, -2px);
  box-shadow: 5px 5px 0 0 var(--color-ink);
}

.brutal-button:active:not(:disabled) {
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0 0 var(--color-ink);
}

.brutal-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.brutal-button--block {
  width: 100%;
}

.brutal-button--secondary {
  background-color: var(--color-blue);
  color: #FFFFFF;
}

.brutal-button--danger {
  background-color: var(--color-pink);
  color: #FFFFFF;
}

.brutal-button--ghost {
  background-color: #FFFFFF;
}

.brutal-button__spinner {
  width: 16px;
  height: 16px;
  border: 3px solid var(--color-ink);
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>