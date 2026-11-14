<template>
  <form class="gift-form" @submit.prevent="onSubmit">
    <BrutalInput v-model="recipientName" label="Nama Sahabat" placeholder="Siapa penerimanya?" />
    <BrutalInput v-model="senderName" label="Nama Kamu" placeholder="Nama pengirim" />
    <div class="field">
      <label class="field__label">Pesan</label>
      <textarea v-model="message" class="brutal-input" rows="4" placeholder="Tulis ucapan..."></textarea>
    </div>
    <div class="field">
      <label class="field__label">Foto (opsional)</label>
      <input type="file" accept="image/*" @change="onFile" />
    </div>
    <BrutalButton type="submit" :loading="uploading" block>Kirim Hadiah</BrutalButton>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import BrutalInput from '../../../components/ui/BrutalInput.vue'
import BrutalButton from '../../../components/ui/BrutalButton.vue'
import { useImageUpload } from '../../../composables/useImageUpload.js'

const emit = defineEmits(['submit'])

const recipientName = ref('')
const senderName = ref('')
const message = ref('')
const imageFile = ref(null)
const { uploading, upload } = useImageUpload()

function onFile(e) {
  imageFile.value = e.target.files?.[0] || null
}

async function onSubmit() {
  let imageUrl = null
  if (imageFile.value) imageUrl = await upload(imageFile.value)

  emit('submit', {
    type: 'friend-greeting',
    recipient_name: recipientName.value,
    sender_name: senderName.value,
    message: message.value,
    image_url: imageUrl,
    title: 'Ucapan ke Sahabat',
  })
}
</script>

<style scoped>
.gift-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.field {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.field__label {
  font-family: var(--font-display);
  font-size: 0.9rem;
}
</style>