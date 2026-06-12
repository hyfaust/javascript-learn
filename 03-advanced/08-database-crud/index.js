/**
 * SQLite CRUD - CLI Mode
 *
 * Core concepts:
 * - readline module for CLI interaction
 * - Menu-driven program flow
 * - Database CRUD operations
 * - Input validation
 */

const readline = require('readline');
const db = require('./database');

// === 1. Initialize Database ===
db.init();

// === 2. Create Readline Interface ===
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer.trim()));
  });
}

// === 3. Display Functions ===
function printTodos(todos) {
  if (todos.length === 0) {
    console.log('\n  No todos found.\n');
    return;
  }

  console.log('\n  ID | Status | Title');
  console.log('  ---|--------|------');
  for (const todo of todos) {
    const status = todo.completed ? '✅' : '⬜';
    console.log(`  ${String(todo.id).padStart(2)} | ${status}     | ${todo.title}`);
  }
  console.log();
}

function printTodo(todo) {
  console.log(`\n  ID: ${todo.id}`);
  console.log(`  Title: ${todo.title}`);
  console.log(`  Status: ${todo.completed ? 'Completed' : 'Pending'}`);
  console.log(`  Created: ${todo.created_at}`);
  console.log(`  Updated: ${todo.updated_at}\n`);
}

// === 4. Menu Actions ===
async function addTodo() {
  const title = await prompt('  Enter todo title: ');
  if (!title) {
    console.log('  Title cannot be empty.\n');
    return;
  }
  const todo = db.createTodo(title);
  console.log(`  ✅ Created todo #${todo.id}: ${todo.title}\n`);
}

async function listTodos() {
  const todos = db.getAllTodos();
  printTodos(todos);
}

async function viewTodo() {
  const id = Number(await prompt('  Enter todo ID: '));
  const todo = db.getTodoById(id);
  if (!todo) {
    console.log(`  ❌ Todo #${id} not found.\n`);
    return;
  }
  printTodo(todo);
}

async function editTodo() {
  const id = Number(await prompt('  Enter todo ID to edit: '));
  const todo = db.getTodoById(id);
  if (!todo) {
    console.log(`  ❌ Todo #${id} not found.\n`);
    return;
  }
  console.log(`  Current title: ${todo.title}`);
  const title = await prompt('  Enter new title: ');
  if (!title) {
    console.log('  Title cannot be empty.\n');
    return;
  }
  const updated = db.updateTodo(id, title);
  console.log(`  ✅ Updated todo #${updated.id}: ${updated.title}\n`);
}

async function toggleTodo() {
  const id = Number(await prompt('  Enter todo ID to toggle: '));
  const todo = db.toggleTodo(id);
  if (!todo) {
    console.log(`  ❌ Todo #${id} not found.\n`);
    return;
  }
  console.log(`  ✅ Todo #${todo.id} is now ${todo.completed ? 'completed' : 'pending'}\n`);
}

async function deleteTodo() {
  const id = Number(await prompt('  Enter todo ID to delete: '));
  const todo = db.deleteTodo(id);
  if (!todo) {
    console.log(`  ❌ Todo #${id} not found.\n`);
    return;
  }
  console.log(`  ✅ Deleted todo #${todo.id}: ${todo.title}\n`);
}

// === 5. Main Menu Loop ===
async function main() {
  console.log('\n=== SQLite Todo CRUD ===\n');

  let running = true;
  while (running) {
    console.log('  1. List all todos');
    console.log('  2. Add a todo');
    console.log('  3. View a todo');
    console.log('  4. Edit a todo');
    console.log('  5. Toggle todo status');
    console.log('  6. Delete a todo');
    console.log('  0. Exit\n');

    const choice = await prompt('  Choose an option: ');

    switch (choice) {
      case '1': await listTodos(); break;
      case '2': await addTodo(); break;
      case '3': await viewTodo(); break;
      case '4': await editTodo(); break;
      case '5': await toggleTodo(); break;
      case '6': await deleteTodo(); break;
      case '0': running = false; break;
      default: console.log('  Invalid option.\n');
    }
  }

  db.close();
  rl.close();
  console.log('Goodbye!');
}

main().catch((err) => {
  console.error('Error:', err.message);
  db.close();
  rl.close();
  process.exit(1);
});

// Ensure DB is closed on unexpected exit
process.on('SIGINT', () => {
  db.close();
  rl.close();
  process.exit(0);
});
