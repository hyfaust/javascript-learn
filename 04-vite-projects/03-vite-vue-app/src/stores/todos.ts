/**
 * Pinia Todos Store
 *
 * Core concepts:
 * - Complex state management
 * - Computed getters with parameters
 * - CRUD actions
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Todo {
  id: number
  text: string
  done: boolean
  createdAt: Date
}

export const useTodosStore = defineStore('todos', () => {
  // State
  const todos = ref<Todo[]>([])
  let nextId = 1

  // Getters
  const totalCount = computed(() => todos.value.length)
  const activeCount = computed(() => todos.value.filter((t) => !t.done).length)
  const completedCount = computed(() => todos.value.filter((t) => t.done).length)
  const allDone = computed(() => todos.value.length > 0 && activeCount.value === 0)

  // Actions
  function addTodo(text: string) {
    todos.value.push({
      id: nextId++,
      text,
      done: false,
      createdAt: new Date(),
    })
  }

  function toggleTodo(id: number) {
    const todo = todos.value.find((t) => t.id === id)
    if (todo) todo.done = !todo.done
  }

  function removeTodo(id: number) {
    todos.value = todos.value.filter((t) => t.id !== id)
  }

  function clearCompleted() {
    todos.value = todos.value.filter((t) => !t.done)
  }

  return {
    todos,
    totalCount,
    activeCount,
    completedCount,
    allDone,
    addTodo,
    toggleTodo,
    removeTodo,
    clearCompleted,
  }
})
