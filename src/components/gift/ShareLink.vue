<template>
  <!-- Komponen untuk menampilkan & menyalin link berbagi -->
  <div class="share-link">
    <input class="brutal-input share-link__input" :value="url" readonly />
    <BrutalButton @click="onCopy" variant="secondary">
      {{ copied ? 'Tersalin!' : 'Salin' }}
    </BrutalButton>
  </div>
</template>

<script setup>
import { useClipboard } from '../../composables/useClipboard.js'
import BrutalButton from '../ui/BrutalButton.vue'

const props = defineProps({
  url: { type: String, required: true },
})

const { copied, copy } = useClipboard()

function onCopy() {
  copy(props.url)
}
</script>

<style scoped>
.share-link {
  display: flex;
  gap: var(--space-2);
  align-items: center;
}

.share-link__input {
  flex: 1;
}
</style>