/**
 * Vite Vanilla App - Main Entry
 *
 * Core concepts:
 * - Vite module resolution (ES module imports in browser)
 * - Hot Module Replacement (HMR)
 * - DOM manipulation with modern patterns
 */

import './style.css'

// === 1. Counter Module ===
function initCounter() {
  const countEl = document.getElementById('count')
  const incrementBtn = document.getElementById('increment')
  const decrementBtn = document.getElementById('decrement')

  let count = 0

  function updateDisplay() {
    countEl.textContent = count
    countEl.classList.add('bump')
    setTimeout(() => countEl.classList.remove('bump'), 200)
  }

  incrementBtn.addEventListener('click', () => {
    count++
    updateDisplay()
  })

  decrementBtn.addEventListener('click', () => {
    count--
    updateDisplay()
  })
}

// === 2. Color Picker Module ===
function initColorPicker() {
  const colorInput = document.getElementById('color-input')
  const colorDisplay = document.getElementById('color-display')
  const colorValue = document.getElementById('color-value')

  function updateColor() {
    const color = colorInput.value
    colorDisplay.style.backgroundColor = color
    colorValue.textContent = color
  }

  colorInput.addEventListener('input', updateColor)
  updateColor() // Initialize
}

// === 3. Todo List Module ===
function initTodoList() {
  const form = document.getElementById('todo-form')
  const input = document.getElementById('todo-input')
  const list = document.getElementById('todo-list')

  const todos = []

  function render() {
    list.innerHTML = todos
      .map(
        (todo, index) => `
        <li class="${todo.done ? 'done' : ''}">
          <span class="todo-text">${escapeHtml(todo.text)}</span>
          <div class="todo-actions">
            <button class="toggle-btn" data-index="${index}">
              ${todo.done ? '↩' : '✓'}
            </button>
            <button class="delete-btn" data-index="${index}">✕</button>
          </div>
        </li>
      `
      )
      .join('')
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const text = input.value.trim()
    if (!text) return
    todos.push({ text, done: false })
    input.value = ''
    render()
  })

  list.addEventListener('click', (e) => {
    const index = Number(e.target.dataset.index)
    if (e.target.classList.contains('toggle-btn')) {
      todos[index].done = !todos[index].done
      render()
    } else if (e.target.classList.contains('delete-btn')) {
      todos.splice(index, 1)
      render()
    }
  })
}

function escapeHtml(text) {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

// === 4. Initialize All Modules ===
initCounter()
initColorPicker()
initTodoList()

// Vite HMR API (optional, for development)
if (import.meta.hot) {
  import.meta.hot.accept()
}
