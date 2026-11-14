// ============================================================
// Entry point aplikasi Vue
// ============================================================
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './app/App.vue'
import router from './router/index.js'
import './styles/main.css'

// Buat instance app
const app = createApp(App)

// Pasang Pinia (state management) & Vue Router
app.use(createPinia())
app.use(router)

// Mount ke #app
app.mount('#app')