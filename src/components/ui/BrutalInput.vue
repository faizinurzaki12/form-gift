<template>
  <label class="brutal-input-wrap">
    <span v-if="label" class="brutal-input-wrap__label">{{ label }}</span>
    <input
      class="brutal-input"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <span v-if="hint" class="brutal-input-wrap__hint">{{ hint }}</span>
  </label>
</template>

<script setup>
defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, default: '' },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  hint: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.brutal-input-wrap {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.brutal-input-wrap__label {
  font-family: var(--font-display);
  font-size: 0.9rem;
}

.brutal-input {
  width: 100%;
  padding: 12px 14px;
  font-size: 1rem;
  color: var(--color-ink);
  background-color: #FFFFFF;
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--radius-squircle);
  box-shadow: var(--shadow-brutal-sm);
  transition: box-shadow var(--transition-fast);
}

.brutal-input:focus {
  outline: none;
  box-shadow: var(--shadow-brutal);
}

.brutal-input-wrap__hint {
  font-size: 0.8rem;
  opacity: 0.7;
}
</style>