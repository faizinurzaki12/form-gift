<template>
  <section class="page-container">
    <h1>Photobooth 📸</h1>
    <p class="subtitle">Buat ruangan baru atau masuk dengan kode.</p>

    <div class="grid grid-2">
      <SquircleCard>
        <h2>Buat Ruangan</h2>
        <p>Buat kode ruangan otomatis untuk diajak temanmu.</p>
        <router-link to="/photobooth/create" class="brutal-btn" style="margin-top:12px; display:inline-flex;">Buat Ruangan</router-link>
      </SquircleCard>

      <SquircleCard>
        <h2>Masuk Ruangan</h2>
        <p>Masuk menggunakan kode yang diberikan host.</p>
        <router-link to="/photobooth/join" class="brutal-btn" style="margin-top:12px; display:inline-flex;">Masuk Ruangan</router-link>
      </SquircleCard>
    </div>
  </section>
</template>

<script setup>
import SquircleCard from '../../components/ui/SquircleCard.vue'
import { deleteExpiredPhotos } from '../../services/supabase/photobooth.repository.js'
deleteExpiredPhotos().catch(() => {})
</script>

<style scoped>
.subtitle { opacity: 0.7; margin-bottom: var(--space-6); }
</style>