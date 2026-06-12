/**
 * Database Layer - SQLite Setup & Queries
 *
 * Core concepts:
 * - better-sqlite3 API
 * - SQL CREATE TABLE, INSERT, SELECT, UPDATE, DELETE
 * - Prepared statements (prevent SQL injection)
 * - Database initialization
 */

const Database = require('better-sqlite3');
const path = require('path');

// === 1. Create / Open Database ===
const DB_PATH = path.join(__dirname, 'todos.db');
const db = new Database(DB_PATH);

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL');

// Prepared statements (created after table exists)
let stmts = null;

// === 2. Initialize Table & Prepared Statements ===
function init() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      completed INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now', 'localtime')),
      updated_at TEXT DEFAULT (datetime('now', 'localtime'))
    )
  `);

  // Create prepared statements after table exists
  stmts = {
    insert: db.prepare('INSERT INTO todos (title) VALUES (?)'),
    selectAll: db.prepare('SELECT * FROM todos ORDER BY id DESC'),
    selectById: db.prepare('SELECT * FROM todos WHERE id = ?'),
    updateTitle: db.prepare(
      "UPDATE todos SET title = ?, updated_at = datetime('now', 'localtime') WHERE id = ?"
    ),
    toggleComplete: db.prepare(
      "UPDATE todos SET completed = CASE WHEN completed = 0 THEN 1 ELSE 0 END, updated_at = datetime('now', 'localtime') WHERE id = ?"
    ),
    delete: db.prepare('DELETE FROM todos WHERE id = ?'),
  };

  console.log('Database initialized.');
}

// === 3. CRUD Operations ===

function createTodo(title) {
  const result = stmts.insert.run(title);
  return getTodoById(result.lastInsertRowid);
}

function getAllTodos() {
  return stmts.selectAll.all();
}

function getTodoById(id) {
  return stmts.selectById.get(id);
}

function updateTodo(id, title) {
  stmts.updateTitle.run(title, id);
  return getTodoById(id);
}

function toggleTodo(id) {
  stmts.toggleComplete.run(id);
  return getTodoById(id);
}

function deleteTodo(id) {
  const todo = getTodoById(id);
  if (!todo) return null;
  stmts.delete.run(id);
  return todo;
}

// === 4. Close Database ===
function close() {
  db.close();
  console.log('Database closed.');
}

module.exports = {
  init,
  createTodo,
  getAllTodos,
  getTodoById,
  updateTodo,
  toggleTodo,
  deleteTodo,
  close,
};
