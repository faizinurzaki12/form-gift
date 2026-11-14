// ============================================================
// Konfigurasi Vue Router (JavaScript murni)
// ============================================================
import { createRouter, createWebHistory } from 'vue-router'

// Lazy-load halaman agar bundle lebih kecil
const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../features/home/HomePage.vue'),
  },
  {
    path: '/create/:type',
    name: 'create',
    component: () => import('../features/create/CreateGiftPage.vue'),
  },
  {
    path: '/gift/:id',
    name: 'gift-view',
    component: () => import('../features/gift-view/GiftViewPage.vue'),
  },
  {
    path: '/my-gifts',
    name: 'my-gifts',
    component: () => import('../features/my-gifts/MyGiftsPage.vue'),
  },
  {
    path: '/photobooth',
    name: 'photobooth-lobby',
    component: () => import('../features/photobooth/PhotoboothLobbyPage.vue'),
  },
  {
    path: '/photobooth/create',
    name: 'photobooth-create',
    component: () => import('../features/photobooth/PhotoboothCreatePage.vue'),
  },
  {
    path: '/photobooth/join',
    name: 'photobooth-join',
    component: () => import('../features/photobooth/PhotoboothJoinPage.vue'),
  },
  {
    path: '/photobooth/room/:code',
    name: 'photobooth-room',
    component: () => import('../features/photobooth/PhotoboothRoomPage.vue'),
  },
  {
    path: '/photobooth/strip/:id',
    name: 'photobooth-strip',
    component: () => import('../features/photobooth/PhotoboothStripPage.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router