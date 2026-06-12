/**
 * Vite + Vue 3 App - Main Entry
 *
 * Core concepts:
 * - Vue 3 createApp
 * - Vue Router integration
 * - Pinia store integration
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
