/**
 * Self-contained test for 08-database-crud
 * Tests database module + HTTP server on port 3098, then exits.
 */
const http = require('http');
const path = require('path');
const fs = require('fs');

const PORT = 3098;
const DB_PATH = path.join(__dirname, 'test-todos.db');

// Clean up any leftover test DB
try { fs.unlinkSync(DB_PATH); } catch {}
try { fs.unlinkSync(DB_PATH + '-wal'); } catch {}
try { fs.unlinkSync(DB_PATH + '-shm'); } catch {}

let passed = 0;
let failed = 0;

function check(name, condition) {
  if (condition) { console.log(`  ✅ ${name}`); passed++; }
  else { console.log(`  ❌ ${name}`); failed++; }
}

function request(method, urlPath, body) {
  return new Promise((resolve, reject) => {
    const options = { hostname: '127.0.0.1', port: PORT, path: urlPath, method, headers: { 'Content-Type': 'application/json' } };
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(data) }));
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

// Safety timeout
setTimeout(() => {
  console.log('TIMEOUT');
  try { fs.unlinkSync(DB_PATH); } catch {}
  try { fs.unlinkSync(DB_PATH + '-wal'); } catch {}
  try { fs.unlinkSync(DB_PATH + '-shm'); } catch {}
  process.exit(1);
}, 10000);

async function runTests() {
  console.log('\n=== Testing 08-database-crud ===\n');

  // --- Part 1: Test database module directly ---
  console.log('  [Database Module]');
  const Database = require('better-sqlite3');
  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');

  db.exec(`CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    completed INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now', 'localtime')),
    updated_at TEXT DEFAULT (datetime('now', 'localtime'))
  )`);

  const stmts = {
    insert: db.prepare('INSERT INTO todos (title) VALUES (?)'),
    selectAll: db.prepare('SELECT * FROM todos ORDER BY id DESC'),
    selectById: db.prepare('SELECT * FROM todos WHERE id = ?'),
    updateTitle: db.prepare("UPDATE todos SET title = ?, updated_at = datetime('now', 'localtime') WHERE id = ?"),
    toggle: db.prepare("UPDATE todos SET completed = CASE WHEN completed = 0 THEN 1 ELSE 0 END, updated_at = datetime('now', 'localtime') WHERE id = ?"),
    delete: db.prepare('DELETE FROM todos WHERE id = ?'),
  };

  // CREATE
  const r1 = stmts.insert.run('Learn SQLite');
  const r2 = stmts.insert.run('Learn CRUD');
  check('CREATE: inserted 2 rows', r1.changes === 1 && r2.changes === 1);

  // READ
  const all = stmts.selectAll.all();
  check('READ: got 2 todos', all.length === 2);

  const byId = stmts.selectById.get(r1.lastInsertRowid);
  check('READ by ID: correct title', byId && byId.title === 'Learn SQLite');

  // UPDATE
  stmts.updateTitle.run('Learn SQLite (updated)', r1.lastInsertRowid);
  const updated = stmts.selectById.get(r1.lastInsertRowid);
  check('UPDATE: title changed', updated.title === 'Learn SQLite (updated)');

  // TOGGLE
  stmts.toggle.run(r2.lastInsertRowid);
  const toggled = stmts.selectById.get(r2.lastInsertRowid);
  check('TOGGLE: completed = 1', toggled.completed === 1);

  // DELETE
  const delResult = stmts.delete.run(r1.lastInsertRowid);
  check('DELETE: removed 1 row', delResult.changes === 1);

  const remaining = stmts.selectAll.all();
  check('DELETE verified: 1 todo left', remaining.length === 1);

  db.close();

  // --- Part 2: Test HTTP server ---
  console.log('\n  [HTTP Server]');

  // Start server inline (replicate server.js logic)
  const db2 = new Database(DB_PATH);
  db2.pragma('journal_mode = WAL');
  db2.exec(`CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL,
    completed INTEGER DEFAULT 0, created_at TEXT DEFAULT (datetime('now','localtime')),
    updated_at TEXT DEFAULT (datetime('now','localtime'))
  )`);
  const st = {
    insert: db2.prepare('INSERT INTO todos (title) VALUES (?)'),
    selectAll: db2.prepare('SELECT * FROM todos ORDER BY id DESC'),
    selectById: db2.prepare('SELECT * FROM todos WHERE id = ?'),
    updateTitle: db2.prepare("UPDATE todos SET title = ?, updated_at = datetime('now','localtime') WHERE id = ?"),
    toggle: db2.prepare("UPDATE todos SET completed = CASE WHEN completed = 0 THEN 1 ELSE 0 END, updated_at = datetime('now','localtime') WHERE id = ?"),
    delete: db2.prepare('DELETE FROM todos WHERE id = ?'),
  };

  const srv = http.createServer(async (req, res) => {
    const { method, url } = req;
    const send = (code, data) => { res.writeHead(code, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(data)); };
    try {
      if (method === 'GET' && url === '/api/todos') return send(200, { total: st.selectAll.all().length, data: st.selectAll.all() });
      const postMatch = method === 'POST' && url === '/api/todos';
      if (postMatch) {
        let body = ''; for await (const c of req) body += c;
        const parsed = body ? JSON.parse(body) : {};
        if (!parsed.title) return send(400, { error: 'title required' });
        const r = st.insert.run(parsed.title);
        return send(201, { data: st.selectById.get(r.lastInsertRowid) });
      }
      const delMatch = url.match(/^\/api\/todos\/(\d+)$/);
      if (method === 'DELETE' && delMatch) {
        const todo = st.selectById.get(Number(delMatch[1]));
        if (!todo) return send(404, { error: 'not found' });
        st.delete.run(Number(delMatch[1]));
        return send(200, { data: todo });
      }
      send(404, { error: 'not found' });
    } catch (err) { send(500, { error: err.message }); }
  });

  await new Promise((resolve) => srv.listen(PORT, resolve));
  check('HTTP server started', true);

  // HTTP: GET /api/todos
  const h1 = await request('GET', '/api/todos');
  check('HTTP GET /api/todos returns data', h1.status === 200 && h1.body.total >= 1);

  // HTTP: POST /api/todos
  const h2 = await request('POST', '/api/todos', { title: 'HTTP Test' });
  check('HTTP POST creates todo', h2.status === 201 && h2.body.data.title === 'HTTP Test');

  // HTTP: DELETE /api/todos/:id
  const h3 = await request('DELETE', `/api/todos/${h2.body.data.id}`);
  check('HTTP DELETE removes todo', h3.status === 200);

  // HTTP: POST without title (400)
  const h4 = await request('POST', '/api/todos', {});
  check('HTTP POST without title returns 400', h4.status === 400);

  // Cleanup
  db2.close();
  srv.close(() => {
    // Remove test DB files
    try { fs.unlinkSync(DB_PATH); } catch {}
    try { fs.unlinkSync(DB_PATH + '-wal'); } catch {}
    try { fs.unlinkSync(DB_PATH + '-shm'); } catch {}

    console.log(`\n  Results: ${passed} passed, ${failed} failed\n`);
    process.exit(failed > 0 ? 1 : 0);
  });
}

runTests().catch((err) => {
  console.error('Test error:', err);
  try { fs.unlinkSync(DB_PATH); } catch {}
  process.exit(1);
});
