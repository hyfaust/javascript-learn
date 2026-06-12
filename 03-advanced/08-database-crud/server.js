/**
 * SQLite CRUD - HTTP Server Mode
 *
 * Core concepts:
 * - http module for REST API
 * - JSON request/response
 * - URL routing
 * - Database operations via HTTP
 */

const http = require('http');
const db = require('./database');

// Initialize database
db.init();

const PORT = process.env.PORT || 3000;

// Parse JSON body from request (with size limit)
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    const MAX_BODY_SIZE = 1024 * 1024; // 1MB
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > MAX_BODY_SIZE) {
        req.destroy();
        reject(new Error('Request body too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

// Send JSON response
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data, null, 2));
}

// === Request Handler ===
const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  try {
    // GET /api/todos - List all
    if (method === 'GET' && url === '/api/todos') {
      const todos = db.getAllTodos();
      return sendJson(res, 200, { total: todos.length, data: todos });
    }

    // GET /api/todos/:id - Get by ID
    const getByIdMatch = url.match(/^\/api\/todos\/(\d+)$/);
    if (method === 'GET' && getByIdMatch) {
      const todo = db.getTodoById(Number(getByIdMatch[1]));
      if (!todo) return sendJson(res, 404, { error: 'Todo not found' });
      return sendJson(res, 200, { data: todo });
    }

    // POST /api/todos - Create
    if (method === 'POST' && url === '/api/todos') {
      const body = await parseBody(req);
      if (!body.title) return sendJson(res, 400, { error: 'title is required' });
      const todo = db.createTodo(body.title);
      return sendJson(res, 201, { message: 'Created', data: todo });
    }

    // PUT /api/todos/:id - Update
    const putMatch = url.match(/^\/api\/todos\/(\d+)$/);
    if (method === 'PUT' && putMatch) {
      const id = Number(putMatch[1]);
      const existing = db.getTodoById(id);
      if (!existing) return sendJson(res, 404, { error: 'Todo not found' });
      const body = await parseBody(req);
      const todo = db.updateTodo(id, body.title || existing.title);
      return sendJson(res, 200, { message: 'Updated', data: todo });
    }

    // PATCH /api/todos/:id/toggle - Toggle status
    const patchMatch = url.match(/^\/api\/todos\/(\d+)\/toggle$/);
    if (method === 'PATCH' && patchMatch) {
      const todo = db.toggleTodo(Number(patchMatch[1]));
      if (!todo) return sendJson(res, 404, { error: 'Todo not found' });
      return sendJson(res, 200, { message: 'Toggled', data: todo });
    }

    // DELETE /api/todos/:id - Delete
    const deleteMatch = url.match(/^\/api\/todos\/(\d+)$/);
    if (method === 'DELETE' && deleteMatch) {
      const todo = db.deleteTodo(Number(deleteMatch[1]));
      if (!todo) return sendJson(res, 404, { error: 'Todo not found' });
      return sendJson(res, 200, { message: 'Deleted', data: todo });
    }

    // Root - API info
    if (method === 'GET' && (url === '/' || url === '/api')) {
      return sendJson(res, 200, {
        name: 'SQLite Todo API',
        endpoints: {
          'GET /api/todos': 'List all todos',
          'GET /api/todos/:id': 'Get a todo by ID',
          'POST /api/todos': 'Create a todo ({ "title": "..." })',
          'PUT /api/todos/:id': 'Update a todo ({ "title": "..." })',
          'PATCH /api/todos/:id/toggle': 'Toggle todo status',
          'DELETE /api/todos/:id': 'Delete a todo',
        },
      });
    }

    // 404
    sendJson(res, 404, { error: `Cannot ${method} ${url}` });
  } catch (err) {
    sendJson(res, 500, { error: err.message });
  }
});

server.listen(PORT, () => {
  console.log(`SQLite Todo API running at http://localhost:${PORT}`);
  console.log('Press Ctrl+C to stop');
});

// Handle listen errors (e.g. EADDRINUSE)
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Error: Port ${PORT} is already in use.`);
    console.error('Try a different port: PORT=3001 node server.js');
  } else {
    console.error('Server error:', err.message);
  }
  db.close();
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down...');
  db.close();
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});
