<template>
  <section class="page-container">
    <BrutalButton variant="ghost" @click="$router.push('/')" style="margin-bottom:12px;">← Kembali</BrutalButton>
    <h1>Photobooth 📸</h1>
    <p class="subtitle">Pilih mode photobooth.</p>

    <div class="grid grid-3">
      <SquircleCard>
        <h2>Sendiri</h2>
        <p>Satu perangkat, satu kamera. Foto berurutan + custom frame.</p>
        <router-link to="/photobooth/solo" class="brutal-btn" style="margin-top:12px; display:inline-flex;">Mulai Solo</router-link>
      </SquircleCard>

      <SquircleCard>
        <h2>Buat Ruangan (2 Orang)</h2>
        <p>Buat kode ruangan untuk diajak teman (real-time).</p>
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
import BrutalButton from '../../components/ui/BrutalButton.vue'
import { deleteExpiredPhotos } from '../../services/supabase/photobooth.repository.js'
deleteExpiredPhotos().catch(() => {})
</script>

<style scoped>
.subtitle { opacity: 0.7; margin-bottom: var(--space-6); }
</style>