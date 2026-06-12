<script setup lang="ts">
/**
 * Counter View
 *
 * Demonstrates:
 * - Pinia store usage (useCounterStore)
 * - Store state, getters, and actions
 * - Conditional rendering (v-if)
 */
import { useCounterStore } from '../stores/counter'

const store = useCounterStore()
</script>

<template>
  <div class="counter-view">
    <div class="counter-card">
      <h2>Pinia Counter</h2>

      <div class="count-display">
        <span
          class="count"
          :class="{ positive: store.isPositive, negative: store.isNegative }"
        >
          {{ store.count }}
        </span>
        <span class="double">× 2 = {{ store.doubleCount }}</span>
      </div>

      <div class="controls">
        <button @click="store.decrement" class="btn">−</button>
        <button @click="store.reset" class="btn reset">Reset</button>
        <button @click="store.increment" class="btn">+</button>
      </div>

      <button
        @click="store.undo"
        :disabled="store.history.length === 0"
        class="btn undo"
      >
        ↩ Undo
      </button>
    </div>

    <div v-if="store.history.length > 0" class="history-card">
      <h3>History</h3>
      <div class="history-items">
        <span
          v-for="(val, index) in store.history"
          :key="index"
          class="history-item"
        >
          {{ val }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.counter-card {
  background: white;
  padding: 32px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  margin-bottom: 20px;
}

.counter-card h2 {
  color: #42b883;
  margin-bottom: 16px;
}

.count-display {
  margin-bottom: 24px;
}

.count {
  font-size: 4em;
  font-weight: bold;
  display: block;
  transition: color 0.2s;
}

.count.positive { color: #42b883; }
.count.negative { color: #e74c3c; }

.double {
  color: #999;
  font-size: 14px;
}

.controls {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 12px;
}

.btn {
  padding: 10px 24px;
  border: 2px solid #42b883;
  background: white;
  color: #42b883;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:hover {
  background: #42b883;
  color: white;
}

.btn.reset {
  border-color: #999;
  color: #999;
  font-size: 14px;
}

.btn.reset:hover {
  background: #999;
  color: white;
}

.btn.undo {
  border-color: #f39c12;
  color: #f39c12;
  font-size: 14px;
}

.btn.undo:hover {
  background: #f39c12;
  color: white;
}

.btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.history-card {
  background: white;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.history-card h3 {
  color: #666;
  font-size: 14px;
  margin-bottom: 8px;
}

.history-items {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.history-item {
  padding: 4px 10px;
  background: #f1f3f5;
  border-radius: 6px;
  font-size: 13px;
  color: #555;
}
</style>
