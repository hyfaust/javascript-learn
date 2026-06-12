/**
 * Pinia Counter Store
 *
 * Core concepts:
 * - Pinia defineStore
 * - State, getters, actions
 * - Reactive state management
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCounterStore = defineStore('counter', () => {
  // State
  const count = ref(0)
  const history = ref<number[]>([])

  // Getters
  const doubleCount = computed(() => count.value * 2)
  const isPositive = computed(() => count.value > 0)
  const isNegative = computed(() => count.value < 0)

  // Actions
  function increment() {
    history.value.push(count.value)
    count.value++
  }

  function decrement() {
    history.value.push(count.value)
    count.value--
  }

  function reset() {
    history.value.push(count.value)
    count.value = 0
  }

  function undo() {
    if (history.value.length > 0) {
      count.value = history.value.pop()!
    }
  }

  return {
    count,
    history,
    doubleCount,
    isPositive,
    isNegative,
    increment,
    decrement,
    reset,
    undo,
  }
})
