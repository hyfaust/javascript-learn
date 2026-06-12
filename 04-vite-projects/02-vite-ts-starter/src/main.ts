/**
 * TypeScript Type Demo
 *
 * Core concepts:
 * - Basic types (string, number, boolean)
 * - Interfaces
 * - Type aliases
 * - Union types
 * - Type guards
 */

// === 1. Interface: Defines the shape of an object ===
interface User {
  id: number
  name: string
  age: number
  email: string
  role: 'admin' | 'user' | 'guest' // Union type (literal)
}

// Example usage of the User interface
const sampleUser: User = {
  id: 1,
  name: 'Alice',
  age: 25,
  email: 'alice@example.com',
  role: 'admin',
}

// === 2. Type Alias: Can represent any type ===
type ValidationResult = {
  valid: boolean
  errors: string[]
}

// === 3. Generic Stack: Demonstrates TypeScript generics ===
class Stack<T> {
  private items: T[] = []

  push(item: T): void {
    this.items.push(item)
  }

  pop(): T | undefined {
    return this.items.pop()
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1]
  }

  get size(): number {
    return this.items.length
  }

  toArray(): T[] {
    return [...this.items]
  }
}

// === 4. Validation Functions with Type Guards ===
function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function isPositiveNumber(value: unknown): value is number {
  return typeof value === 'number' && value > 0
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function validateUser(data: Record<string, unknown>): ValidationResult {
  const errors: string[] = []

  if (!isNonEmptyString(data.name)) {
    errors.push('Name must be a non-empty string')
  }

  if (!isPositiveNumber(data.age)) {
    errors.push('Age must be a positive number')
  } else if (data.age < 1 || data.age > 150) {
    errors.push('Age must be between 1 and 150')
  }

  if (!isNonEmptyString(data.email)) {
    errors.push('Email is required')
  } else if (!isValidEmail(data.email)) {
    errors.push('Email format is invalid')
  }

  return { valid: errors.length === 0, errors }
}

// === 5. Render Functions ===
function renderTypeDemo(container: HTMLElement): void {
  // Demonstrate various TypeScript features
  const examples = [
    {
      label: 'String literal',
      code: 'const name: string = "TypeScript"',
      value: 'TypeScript',
    },
    {
      label: 'Number literal',
      code: 'const version: number = 5.6',
      value: '5.6',
    },
    {
      label: 'Boolean literal',
      code: 'const isAwesome: boolean = true',
      value: 'true',
    },
    {
      label: 'Array type',
      code: 'const nums: number[] = [1, 2, 3]',
      value: '[1, 2, 3]',
    },
    {
      label: 'Tuple type',
      code: 'const pair: [string, number] = ["age", 25]',
      value: '["age", 25]',
    },
    {
      label: 'Union type',
      code: 'type Status = "loading" | "success" | "error"',
      value: '"loading" | "success" | "error"',
    },
    {
      label: 'Interface',
      code: 'interface User { id: number; name: string; ... }',
      value: sampleUser.name,
    },
  ]

  container.innerHTML = examples
    .map(
      (ex) => `
      <div class="type-example">
        <span class="type-label">${ex.label}</span>
        <code class="type-code">${ex.code}</code>
        <span class="type-value">→ ${ex.value}</span>
      </div>
    `
    )
    .join('')
}

// === 6. Initialize App ===
function initApp(): void {
  // Type demo
  const typeDemoEl = document.getElementById('type-demo')!
  renderTypeDemo(typeDemoEl)

  // Stack demo
  const stack = new Stack<string>()
  const stackInput = document.getElementById('stack-input') as HTMLInputElement
  const pushBtn = document.getElementById('push-btn')!
  const popBtn = document.getElementById('pop-btn')!
  const stackDisplay = document.getElementById('stack-display')!

  function renderStack(): void {
    const items = stack.toArray()
    if (items.length === 0) {
      stackDisplay.innerHTML = '<span class="empty">Stack is empty</span>'
    } else {
      stackDisplay.innerHTML = items
        .map((item, i) => `<span class="stack-item${i === items.length - 1 ? ' top' : ''}">${item}</span>`)
        .join('')
    }
  }

  pushBtn.addEventListener('click', () => {
    const value = stackInput.value.trim()
    if (value) {
      stack.push(value)
      stackInput.value = ''
      renderStack()
    }
  })

  popBtn.addEventListener('click', () => {
    const item = stack.pop()
    if (item !== undefined) {
      console.log('Popped:', item)
      renderStack()
    }
  })

  stackInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') pushBtn.click()
  })

  renderStack()

  // Profile validator
  const profileForm = document.getElementById('profile-form') as HTMLFormElement
  const resultDiv = document.getElementById('validation-result')!

  profileForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const nameInput = document.getElementById('name-input') as HTMLInputElement
    const ageInput = document.getElementById('age-input') as HTMLInputElement
    const emailInput = document.getElementById('email-input') as HTMLInputElement

    const result = validateUser({
      name: nameInput.value,
      age: Number(ageInput.value),
      email: emailInput.value,
    })

    if (result.valid) {
      resultDiv.innerHTML = '<div class="success">✅ All fields are valid!</div>'
    } else {
      resultDiv.innerHTML = `<div class="error">${result.errors.map((e) => `<div>❌ ${e}</div>`).join('')}</div>`
    }
  })
}

initApp()
