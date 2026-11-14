<template>
  <section class="page-container">
    <BrutalButton variant="ghost" @click="$router.push('/photobooth')" style="margin-bottom:12px;">← Kembali</BrutalButton>
    <div v-if="loading" class="squircle-card">Memuat strip...</div>
    <div v-else-if="error" class="squircle-card">
      <p class="error-text">{{ error }}</p>
    </div>
    <div v-else-if="strip" class="squircle-card" style="text-align:center;">
      <h2>Photobooth Strip 📸</h2>
      <img :src="strip.public_url" alt="strip" class="strip-image" />
      <a :href="strip.public_url" download class="brutal-btn" style="margin-top:12px; display:inline-flex;">Download</a>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import BrutalButton from '../../components/ui/BrutalButton.vue'
import { getSupabase } from '../../services/supabase/client.js'

const route = useRoute()
const strip = ref(null)
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  const id = route.params.id
  const supabase = getSupabase()
  if (!supabase) {
    error.value = 'Supabase belum terhubung.'
    loading.value = false
    return
  }
  try {
    const { data, error: e } = await supabase
      .from('photobooth_strips')
      .select('*')
      .eq('id', id)
      .single()
    if (e) throw e
    strip.value = data
  } catch (e) {
    error.value = 'Strip tidak ditemukan.'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.strip-image {
  max-width: 100%;
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--radius-squircle);
  box-shadow: var(--shadow-brutal);
  margin: var(--space-4) 0;
}
.error-text { color: var(--color-pink); font-weight: 600; }
</style>