<script setup lang="ts">
/**
 * App Root Component
 *
 * Core concepts:
 * - <script setup> syntax
 * - Vue Router <RouterView> and <RouterLink>
 * - Reactive navigation
 */
</script>

<template>
  <div class="app">
    <header class="app-header">
      <h1>🟢 Vite + Vue 3</h1>
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/counter">Counter</RouterLink>
        <RouterLink to="/todos">Todos</RouterLink>
      </nav>
    </header>

    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-header {
  background: #42b883;
  color: white;
  padding: 16px 24px;
  text-align: center;
}

.app-header h1 {
  font-size: 1.4em;
  margin-bottom: 12px;
}

nav {
  display: flex;
  justify-content: center;
  gap: 16px;
}

nav a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  padding: 4px 12px;
  border-radius: 6px;
  transition: all 0.2s;
}

nav a:hover,
nav a.router-link-active {
  color: white;
  background: rgba(255, 255, 255, 0.2);
}

.app-main {
  max-width: 600px;
  margin: 24px auto;
  padding: 0 20px;
}
</style>
