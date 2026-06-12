<script setup lang="ts">
/**
 * Todos View
 *
 * Demonstrates:
 * - Pinia store with CRUD operations
 * - v-model for form input
 * - v-for with transitions
 * - Computed properties in templates
 */
import { ref } from 'vue'
import { useTodosStore } from '../stores/todos'

const store = useTodosStore()
const newTodoText = ref('')

function handleAdd() {
  const text = newTodoText.value.trim()
  if (!text) return
  store.addTodo(text)
  newTodoText.value = ''
}
</script>

<template>
  <div class="todos-view">
    <div class="todos-card">
      <h2>📝 Todo List (Pinia)</h2>

      <form @submit.prevent="handleAdd" class="add-form">
        <input
          v-model="newTodoText"
          placeholder="What needs to be done?"
          class="todo-input"
        />
        <button type="submit" class="add-btn">Add</button>
      </form>

      <div class="stats">
        <span>Total: {{ store.totalCount }}</span>
        <span>Active: {{ store.activeCount }}</span>
        <span>Done: {{ store.completedCount }}</span>
      </div>

      <TransitionGroup name="todo" tag="ul" class="todo-list">
        <li
          v-for="todo in store.todos"
          :key="todo.id"
          class="todo-item"
          :class="{ done: todo.done }"
        >
          <label class="todo-label">
            <input
              type="checkbox"
              :checked="todo.done"
              @change="store.toggleTodo(todo.id)"
            />
            <span class="todo-text">{{ todo.text }}</span>
          </label>
          <button @click="store.removeTodo(todo.id)" class="remove-btn">✕</button>
        </li>
      </TransitionGroup>

      <p v-if="store.todos.length === 0" class="empty">
        No todos yet. Add one above!
      </p>

      <button
        v-if="store.completedCount > 0"
        @click="store.clearCompleted"
        class="clear-btn"
      >
        Clear completed ({{ store.completedCount }})
      </button>
    </div>
  </div>
</template>

<style scoped>
.todos-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.todos-card h2 {
  color: #42b883;
  margin-bottom: 16px;
}

.add-form {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.todo-input {
  flex: 1;
  padding: 10px 14px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
}

.todo-input:focus {
  border-color: #42b883;
}

.add-btn {
  padding: 10px 20px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.stats {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: #999;
  margin-bottom: 12px;
}

.todo-list {
  list-style: none;
}

.todo-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-bottom: 1px solid #f1f3f5;
}

.todo-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  flex: 1;
}

.todo-text {
  font-size: 15px;
}

.todo-item.done .todo-text {
  text-decoration: line-through;
  color: #999;
}

.remove-btn {
  background: none;
  border: none;
  color: #ccc;
  font-size: 16px;
  cursor: pointer;
  padding: 4px 8px;
}

.remove-btn:hover {
  color: #e74c3c;
}

.empty {
  text-align: center;
  color: #999;
  padding: 20px;
  font-style: italic;
}

.clear-btn {
  width: 100%;
  margin-top: 12px;
  padding: 8px;
  background: none;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  color: #999;
  cursor: pointer;
}

.clear-btn:hover {
  background: #f8f9fa;
  color: #e74c3c;
}

/* TransitionGroup animations */
.todo-enter-active,
.todo-leave-active {
  transition: all 0.3s ease;
}

.todo-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.todo-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
