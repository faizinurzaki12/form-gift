<template>
  <div class="editor">
    <h2>Editor Custom Photobooth</h2>

    <!-- Area preview strip -->
    <div class="editor__preview">
      <div
        ref="stripRef"
        class="strip"
        :style="{
          backgroundColor: store.customization.background,
          borderColor: store.customization.borderColor,
          borderWidth: store.customization.borderWidth + 'px',
          borderRadius: store.customization.radius + 'px',
          gap: store.customization.gap + 'px',
        }"
      >
        <div class="strip__title" v-if="store.customization.title">{{ store.customization.title }}</div>

        <div class="strip__grid" :class="`strip__grid--${store.layout}`">
          <div
            v-for="(photo, i) in store.photos"
            :key="i"
            class="strip__photo"
            :style="{ borderRadius: store.customization.radius + 'px' }"
          >
            <img :src="photo" alt="foto" :style="{ filter: filterCss }" />
          </div>
        </div>

        <div class="strip__footer" v-if="store.customization.footer">{{ store.customization.footer }}</div>

        <!-- Stiker -->
        <div
          v-for="s in store.customization.stickers"
          :key="s.id"
          class="sticker"
          :style="{
            left: s.x + '%',
            top: s.y + '%',
            fontSize: s.size + 'px',
            transform: `rotate(${s.rotation}deg)`,
          }"
          @pointerdown="startDrag(s, $event)"
        >
          {{ s.emoji }}
        </div>
      </div>
    </div>

    <!-- Kontrol custom -->
    <div class="editor__controls squircle-card">
      <div class="control">
        <label>Judul</label>
        <input v-model="store.customization.title" class="brutal-input" placeholder="Judul strip" />
      </div>
      <div class="control">
        <label>Footer</label>
        <input v-model="store.customization.footer" class="brutal-input" placeholder="Teks bawah" />
      </div>

      <div class="control">
        <label>Warna Background</label>
        <input type="color" v-model="store.customization.background" />
      </div>
      <div class="control">
        <label>Warna Border</label>
        <input type="color" v-model="store.customization.borderColor" />
      </div>
      <div class="control">
        <label>Tebal Border: {{ store.customization.borderWidth }}px</label>
        <input type="range" min="0" max="8" v-model.number="store.customization.borderWidth" />
      </div>
      <div class="control">
        <label>Radius: {{ store.customization.radius }}px</label>
        <input type="range" min="0" max="40" v-model.number="store.customization.radius" />
      </div>
      <div class="control">
        <label>Gap: {{ store.customization.gap }}px</label>
        <input type="range" min="0" max="24" v-model.number="store.customization.gap" />
      </div>

      <div class="control">
        <label>Filter Foto</label>
        <select v-model="store.customization.filter" class="brutal-input">
          <option value="none">Normal</option>
          <option value="grayscale">Hitam Putih</option>
          <option value="sepia">Sepia</option>
          <option value="vintage">Vintage</option>
          <option value="bright">Cerah</option>
        </select>
      </div>

      <div class="control">
        <label>Frame Cepat</label>
        <div class="frame-presets">
          <button type="button" class="frame-preset" style="background:#FF6B9D" @click="setFrame('#FF6B9D','#1A1A1A')"></button>
          <button type="button" class="frame-preset" style="background:#FFF7EC" @click="setFrame('#FFF7EC','#1A1A1A')"></button>
          <button type="button" class="frame-preset" style="background:#6BCB77" @click="setFrame('#6BCB77','#1A1A1A')"></button>
          <button type="button" class="frame-preset" style="background:#4D96FF" @click="setFrame('#4D96FF','#FFFFFF')"></button>
          <button type="button" class="frame-preset" style="background:#1A1A1A" @click="setFrame('#1A1A1A','#FFFFFF')"></button>
        </div>
      </div>

      <!-- Stiker picker -->
      <div class="control">
        <label>Stiker Lucu</label>
        <div class="sticker-picker">
          <button
            v-for="e in stickerOptions"
            :key="e"
            type="button"
            class="sticker-option"
            @click="addSticker(e)"
          >{{ e }}</button>
        </div>
        <p class="hint">Klik stiker untuk menambahkan; drag untuk memindahkan.</p>
      </div>

      <!-- Slider ukuran & rotasi stiker terpilih -->
      <div v-if="selectedSticker" class="control">
        <label>Ukuran Stiker: {{ selectedSticker.size }}px</label>
        <input type="range" min="24" max="96" v-model.number="selectedSticker.size" />
        <label>Rotasi: {{ selectedSticker.rotation }}°</label>
        <input type="range" min="-180" max="180" v-model.number="selectedSticker.rotation" />
        <BrutalButton variant="danger" @click="removeSelectedSticker">Hapus Stiker</BrutalButton>
      </div>

      <div class="editor__actions">
        <BrutalButton @click="downloadPng" variant="secondary">Download PNG</BrutalButton>
        <BrutalButton @click="saveToSupabase" :loading="saving">Simpan & Dapatkan Link</BrutalButton>
      </div>

      <p v-if="saveLink" class="save-link">
        Link: <a :href="saveLink" target="_blank">{{ saveLink }}</a>
      </p>
      <p v-if="error" class="error-text">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import BrutalButton from '../ui/BrutalButton.vue'
import { usePhotoboothStore } from '../../stores/photobooth.store.js'
import { toPng } from 'html-to-image'
import { saveStrip, uploadFile } from '../../services/supabase/photobooth.repository.js'

const router = useRouter()
const store = usePhotoboothStore()

const stripRef = ref(null)
const saving = ref(false)
const saveLink = ref(null)
const error = ref(null)

const stickerOptions = ['🧸', '🐰', '🐱', '🐶', '🐻', '🐼', '🦊', '🐸', '🦄', '⭐', '💖', '🌸', '🎀', '👑', '🌈']

const selectedStickerId = ref(null)
const selectedSticker = computed(() => store.customization.stickers.find((s) => s.id === selectedStickerId.value) || null)

const filterCss = computed(() => {
  switch (store.customization.filter) {
    case 'grayscale': return 'grayscale(1)'
    case 'sepia': return 'sepia(0.8)'
    case 'vintage': return 'sepia(0.4) contrast(1.1) brightness(0.9)'
    case 'bright': return 'brightness(1.15) saturate(1.2)'
    default: return 'none'
  }
})

function setFrame(bg, border) {
  store.customization.background = bg
  store.customization.borderColor = border
}

function addSticker(emoji) {
  const id = 'stk-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6)
  store.customization.stickers.push({ id, emoji, x: 10, y: 10, size: 48, rotation: 0 })
  selectedStickerId.value = id
}

function removeSelectedSticker() {
  if (!selectedStickerId.value) return
  store.customization.stickers = store.customization.stickers.filter((s) => s.id !== selectedStickerId.value)
  selectedStickerId.value = null
}

// Drag sticker
let draggingId = null
let offset = { x: 0, y: 0 }

function startDrag(sticker, event) {
  selectedStickerId.value = sticker.id
  draggingId = sticker.id
  const rect = event.currentTarget.parentElement.getBoundingClientRect()
  offset.x = event.clientX - (rect.left + (sticker.x / 100) * rect.width)
  offset.y = event.clientY - (rect.top + (sticker.y / 100) * rect.height)
  window.addEventListener('pointermove', onDrag)
  window.addEventListener('pointerup', endDrag)
}

function onDrag(event) {
  if (!draggingId) return
  const sticker = store.customization.stickers.find((s) => s.id === draggingId)
  if (!sticker) return
  const strip = stripRef.value
  if (!strip) return
  const rect = strip.getBoundingClientRect()
  const x = ((event.clientX - offset.x - rect.left) / rect.width) * 100
  const y = ((event.clientY - offset.y - rect.top) / rect.height) * 100
  sticker.x = Math.max(0, Math.min(90, x))
  sticker.y = Math.max(0, Math.min(90, y))
}

function endDrag() {
  draggingId = null
  window.removeEventListener('pointermove', onDrag)
  window.removeEventListener('pointerup', endDrag)
}

async function downloadPng() {
  if (!stripRef.value) return
  try {
    const dataUrl = await toPng(stripRef.value, { cacheBust: true, pixelRatio: 2 })
    const link = document.createElement('a')
    link.download = 'photobooth-strip.png'
    link.href = dataUrl
    link.click()
  } catch (e) {
    error.value = 'Gagal mengunduh gambar.'
  }
}

async function saveToSupabase() {
  if (!stripRef.value) return
  saving.value = true
  error.value = null
  try {
    const dataUrl = await toPng(stripRef.value, { cacheBust: true, pixelRatio: 2 })
    // Convert dataUrl ke Blob
    const res = await fetch(dataUrl)
    const blob = await res.blob()
    const file = new File([blob], 'strip.png', { type: 'image/png' })
    const path = `strips/${Date.now()}.png`
    const publicUrl = await uploadFile('photobooth', path, file)
    const record = await saveStrip(store.roomCode, path, publicUrl, store.customization)
    if (record?.id) {
      saveLink.value = `${window.location.origin}/photobooth/strip/${record.id}`
    }
  } catch (e) {
    error.value = e.message || 'Gagal menyimpan ke Supabase.'
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.editor { display: flex; flex-direction: column; gap: var(--space-6); }
.editor__preview { display: flex; justify-content: center; }
.strip {
  position: relative;
  border-style: solid;
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  min-width: 260px;
  max-width: 420px;
}
.strip__title, .strip__footer {
  text-align: center;
  font-family: var(--font-display);
}
.strip__grid {
  display: grid;
  gap: inherit;
}
.strip__grid--2-horizontal { grid-template-columns: repeat(2, 1fr); }
.strip__grid--2x2 { grid-template-columns: repeat(2, 1fr); }
.strip__grid--3x3 { grid-template-columns: repeat(3, 1fr); }
.strip__photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.sticker {
  position: absolute;
  cursor: grab;
  user-select: none;
  touch-action: none;
}
.editor__controls {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
.control { display: flex; flex-direction: column; gap: var(--space-2); }
.control label { font-family: var(--font-display); font-size: 0.9rem; }
.sticker-picker { display: flex; flex-wrap: wrap; gap: var(--space-2); }
.sticker-option {
  font-size: 1.5rem;
  padding: 6px;
  border: 2px solid var(--color-border);
  border-radius: 8px;
  background-color: #FFFFFF;
  cursor: pointer;
}
.hint { font-size: 0.8rem; opacity: 0.7; }
.editor__actions { display: flex; gap: var(--space-3); flex-wrap: wrap; }
.save-link { word-break: break-all; }
.error-text { color: var(--color-pink); font-weight: 600; }

.frame-presets { display: flex; gap: var(--space-2); }
.frame-preset {
  width: 32px;
  height: 32px;
  border: 2px solid var(--color-border);
  border-radius: 8px;
  cursor: pointer;
}
</style>