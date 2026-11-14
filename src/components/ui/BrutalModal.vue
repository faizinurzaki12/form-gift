<template>
  <Teleport to="body">
    <div v-if="modelValue" class="modal-backdrop" @click.self="close">
      <div class="modal-card squircle-card">
        <div class="modal-card__header">
          <h3>{{ title }}</h3>
          <button class="modal-close" @click="close" aria-label="Tutup">✕</button>
        </div>
        <div class="modal-card__body">
          <slot />
        </div>
        <div v-if="$slots.footer" class="modal-card__footer">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue'])

function close() {
  emit('update:modelValue', false)
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--space-4);
}

.modal-card {
  width: 100%;
  max-width: 520px;
  max-height: 90vh;
  overflow: auto;
}

.modal-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-4);
}

.modal-close {
  font-family: var(--font-display);
  font-size: 1.2rem;
  padding: 4px 10px;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-squircle);
  background-color: #FFFFFF;
  box-shadow: var(--shadow-brutal-sm);
}
</style>