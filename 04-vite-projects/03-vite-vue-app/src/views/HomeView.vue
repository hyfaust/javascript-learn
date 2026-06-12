<script setup lang="ts">
/**
 * Home View
 *
 * Demonstrates Vue 3 composition API basics:
 * - ref() for reactive data
 * - computed() for derived values
 * - Template syntax (v-bind, v-on, v-if, v-for)
 */
import { ref, computed } from 'vue'

const name = ref('Vue Developer')
const greeting = computed(() => `Hello, ${name.value}! 👋`)
const features = [
  { icon: '⚡', title: 'Vite', desc: 'Lightning-fast HMR and build' },
  { icon: '🟢', title: 'Vue 3', desc: 'Composition API and SFC' },
  { icon: '📦', title: 'Pinia', desc: 'Intuitive state management' },
  { icon: '🧭', title: 'Vue Router', desc: 'Client-side routing' },
]
</script>

<template>
  <div class="home">
    <div class="greeting-card">
      <h2>{{ greeting }}</h2>
      <p>Edit your name below to see reactivity in action:</p>
      <input v-model="name" placeholder="Enter your name" class="name-input" />
    </div>

    <div class="features-grid">
      <div v-for="feature in features" :key="feature.title" class="feature-card">
        <span class="feature-icon">{{ feature.icon }}</span>
        <h3>{{ feature.title }}</h3>
        <p>{{ feature.desc }}</p>
      </div>
    </div>

    <div class="info">
      <p>This app demonstrates Vue 3's Composition API with <code>&lt;script setup&gt;</code></p>
    </div>
  </div>
</template>

<style scoped>
.greeting-card {
  text-align: center;
  background: white;
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.greeting-card h2 {
  color: #42b883;
  margin-bottom: 8px;
}

.name-input {
  width: 100%;
  max-width: 300px;
  padding: 8px 12px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 16px;
  text-align: center;
  margin-top: 12px;
  outline: none;
  transition: border-color 0.2s;
}

.name-input:focus {
  border-color: #42b883;
}

.features-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.feature-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.feature-icon {
  font-size: 2em;
  display: block;
  margin-bottom: 8px;
}

.feature-card h3 {
  color: #333;
  margin-bottom: 4px;
}

.feature-card p {
  color: #666;
  font-size: 14px;
}

.info {
  text-align: center;
  color: #666;
  font-size: 14px;
  margin-top: 24px;
}

.info code {
  background: #e9ecef;
  padding: 2px 6px;
  border-radius: 4px;
}
</style>
