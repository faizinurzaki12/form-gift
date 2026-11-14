<template>
  <section class="page-container">
    <div class="home-hero">
      <h1>Birthday Surprise 🎂</h1>
      <p>Pilih jenis hadiah, personalisasi, lalu bagikan link surprise-nya!</p>
    </div>

    <div class="grid grid-3">
      <GiftTypeCard
        v-for="g in gifts"
        :key="g.type"
        :icon="g.icon"
        :title="g.title"
        :description="g.description"
        :color="g.color"
        :to="`/create/${g.type}`"
      />
    </div>
  </section>
</template>

<script setup>
import GiftTypeCard from '../../components/gift/GiftTypeCard.vue'

// Daftar jenis hadiah yang tersedia
const gifts = [
  { type: 'friend-greeting', icon: '🤝', title: 'Ucapan ke Sahabat', description: 'Kartu ucapan hangat untuk sahabat.', color: 'var(--color-green)' },
  { type: 'lover-greeting', icon: '💖', title: 'Ucapan ke Pacar', description: 'Ucapan manis untuk pasangan.', color: 'var(--color-pink)' },
  { type: 'love-letter', icon: '💌', title: 'Surat Cinta', description: 'Surat cinta digital dengan foto.', color: 'var(--color-purple)' },
  { type: 'birthday-cake', icon: '🎂', title: 'Kue Ulang Tahun', description: 'Kue virtual tiup lilin + musik.', color: 'var(--color-yellow)' },
  { type: 'photobooth', icon: '📸', title: 'Photobooth', description: 'Foto bersama via kode ruangan.', color: 'var(--color-blue)' },
]
</script>

<style scoped>
.home-hero {
  text-align: center;
  margin-bottom: var(--space-8);
}

.home-hero h1 {
  font-size: 2.5rem;
  margin-bottom: var(--space-2);
}

.home-hero p {
  font-size: 1.1rem;
  opacity: 0.8;
}
</style>