<template>
  <form class="gift-form" @submit.prevent="onSubmit">
    <BrutalInput v-model="recipientName" label="Nama yang Berulang Tahun" placeholder="Nama penerima" />
    <BrutalInput v-model="senderName" label="Dari" placeholder="Nama pengirim" />
    <div class="field">
      <label class="field__label">Pesan Ucapan</label>
      <textarea v-model="message" class="brutal-input" rows="4" placeholder="Selamat ulang tahun..."></textarea>
    </div>

    <div class="field">
      <label class="field__label">Jumlah Lilin</label>
      <input type="range" min="3" max="10" v-model.number="candleCount" />
      <span>{{ candleCount }} lilin</span>
    </div>

    <div class="field">
      <label class="field__label">Gaya Kue</label>
      <select v-model="cakeStyle" class="brutal-input">
        <option value="classic">Klasik</option>
        <option value="chocolate">Cokelat</option>
        <option value="strawberry">Stroberi</option>
      </select>
    </div>

    <div class="field">
      <label class="field__label">Foto (opsional)</label>
      <input type="file" accept="image/*" @change="onFile" />
      <img v-if="imagePreview" :src="imagePreview" alt="preview" class="image-preview" />
    </div>

    <!-- Musik YouTube -->
    <div class="field">
      <label class="field__label">Musik Latar (YouTube)</label>
      <div class="music-search">
        <BrutalInput v-model="searchQuery" placeholder="Cari lagu..." />
        <BrutalButton type="button" @click="doSearch" :loading="yt.loading">Cari</BrutalButton>
      </div>
      <p v-if="yt.error" class="error-text">{{ yt.error }}</p>

      <!-- Hasil pencarian -->
      <div v-if="yt.results.length" class="search-results">
        <button
          v-for="r in yt.results"
          :key="r.id"
          type="button"
          class="search-result"
          :class="{ 'search-result--active': selectedVideoId === r.id }"
          @click="selectVideo(r.id)"
        >
          <img :src="r.thumbnail" alt="" />
          <div>
            <div class="search-result__title">{{ r.title }}</div>
            <div class="search-result__channel">{{ r.channel }}</div>
          </div>
        </button>
      </div>

      <!-- Fallback paste link -->
      <BrutalInput v-model="pasteLink" label="Atau tempel link/ID YouTube" placeholder="https://youtube.com/watch?v=..." />
      <BrutalButton type="button" variant="secondary" @click="applyPaste">Gunakan Link</BrutalButton>

      <p v-if="selectedVideoId" class="selected-video">Video terpilih: {{ selectedVideoId }}</p>
    </div>

    <BrutalButton type="submit" block>Buat Kue</BrutalButton>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import BrutalInput from '../../../components/ui/BrutalInput.vue'
import BrutalButton from '../../../components/ui/BrutalButton.vue'
import { useYouTubeSearch } from '../../../composables/useYouTubeSearch.js'
import { useImageUpload } from '../../../composables/useImageUpload.js'

const emit = defineEmits(['submit'])

const recipientName = ref('')
const senderName = ref('')
const message = ref('')
const candleCount = ref(5)
const cakeStyle = ref('classic')
const imageFile = ref(null)
const imagePreview = ref(null)
const { uploading: imageUploading, upload: uploadImage } = useImageUpload()

const searchQuery = ref('')
const pasteLink = ref('')
const selectedVideoId = ref(null)

const yt = useYouTubeSearch()

function onFile(e) {
  imageFile.value = e.target.files?.[0] || null
  if (imageFile.value) imagePreview.value = URL.createObjectURL(imageFile.value)
  else imagePreview.value = null
}

async function doSearch() {
  await yt.search(searchQuery.value)
}

function selectVideo(id) {
  selectedVideoId.value = id
}

function applyPaste() {
  const id = yt.extractVideoId(pasteLink.value)
  if (id) selectedVideoId.value = id
}

async function onSubmit() {
  let imageUrl = null
  if (imageFile.value) imageUrl = await uploadImage(imageFile.value)

  emit('submit', {
    type: 'birthday-cake',
    recipient_name: recipientName.value,
    sender_name: senderName.value,
    message: message.value,
    image_url: imageUrl,
    title: 'Kue Ulang Tahun',
    cake_config: {
      candles: candleCount.value,
      style: cakeStyle.value,
      youtubeVideoId: selectedVideoId.value,
    },
  })
}
</script>

<style scoped>
.gift-form { display: flex; flex-direction: column; gap: var(--space-4); }
.field { display: flex; flex-direction: column; gap: var(--space-2); }
.field__label { font-family: var(--font-display); font-size: 0.9rem; }
.music-search { display: flex; gap: var(--space-2); align-items: end; }
.search-results {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  max-height: 260px;
  overflow: auto;
  margin-top: var(--space-2);
}
.search-result {
  display: flex;
  gap: var(--space-2);
  align-items: center;
  padding: var(--space-2);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-squircle);
  background-color: #FFFFFF;
  cursor: pointer;
  text-align: left;
}
.search-result--active {
  background-color: var(--color-yellow);
}
.search-result img {
  width: 64px;
  height: 48px;
  object-fit: cover;
  border-radius: 8px;
}
.search-result__title { font-size: 0.85rem; font-weight: 600; }
.search-result__channel { font-size: 0.75rem; opacity: 0.7; }
.selected-video { font-size: 0.85rem; font-weight: 600; }
.error-text { color: var(--color-pink); font-weight: 600; }
.image-preview {
  margin-top: var(--space-2);
  max-height: 160px;
  border-radius: var(--radius-squircle);
  border: var(--border-width) solid var(--color-border);
  box-shadow: var(--shadow-brutal-sm);
}
</style>