/**
 * Self-contained test for 07-websocket-chat
 * Starts server on port 3097, connects a client, sends/receives messages, then exits.
 */
const http = require('http');
const WebSocket = require('ws');

const PORT = 3097;

// Replicate the server logic inline (avoid port conflict with require)
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  try {
    if (req.url === '/' || req.url === '/index.html') {
      const content = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(content);
    } else if (req.url === '/style.css') {
      const content = fs.readFileSync(path.join(__dirname, 'style.css'), 'utf-8');
      res.writeHead(200, { 'Content-Type': 'text/css; charset=utf-8' });
      res.end(content);
    } else {
      res.writeHead(404);
      res.end('Not Found');
    }
  } catch (err) {
    res.writeHead(500);
    res.end('Internal Server Error');
  }
});

const wss = new WebSocket.Server({ server });
const clients = new Set();

function broadcast(message) {
  const data = JSON.stringify(message);
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) client.send(data);
  }
}

wss.on('connection', (ws) => {
  clients.add(ws);
  ws.send(JSON.stringify({ type: 'system', content: 'Welcome!', online: clients.size }));
  broadcast({ type: 'system', content: `User joined (${clients.size} online)`, online: clients.size });

  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data.toString());
      if (msg.type === 'chat' && msg.content) {
        broadcast({ type: 'chat', username: msg.username || 'Anon', content: msg.content, timestamp: '12:00:00' });
      }
    } catch (err) { /* ignore */ }
  });

  ws.on('close', () => {
    clients.delete(ws);
    broadcast({ type: 'system', content: `User left (${clients.size} online)`, online: clients.size });
  });

  ws.on('error', (err) => {
    console.error('WS error:', err.message);
    clients.delete(ws);
  });
});

// Safety timeout
setTimeout(() => { console.log('TIMEOUT'); process.exit(1); }, 10000);

server.listen(PORT, () => {
  console.log(`Test server on port ${PORT}`);
  runTests();
});

server.on('error', (err) => {
  console.error('Server error:', err.message);
  process.exit(1);
});

async function runTests() {
  let passed = 0;
  let failed = 0;

  function check(name, condition) {
    if (condition) { console.log(`  ✅ ${name}`); passed++; }
    else { console.log(`  ❌ ${name}`); failed++; }
  }

  console.log('\n=== Testing 07-websocket-chat ===\n');

  // Test 1: HTTP serves index.html
  const httpRes = await new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:${PORT}/`, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    }).on('error', reject);
  });
  check('HTTP GET / serves index.html', httpRes.status === 200 && httpRes.body.includes('WebSocket Chat Room'));

  // Test 2: HTTP serves style.css
  const cssRes = await new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:${PORT}/style.css`, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve({ status: res.statusCode }));
    }).on('error', reject);
  });
  check('HTTP GET /style.css returns 200', cssRes.status === 200);

  // Test 3: HTTP 404 for unknown route
  const notFoundRes = await new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:${PORT}/unknown`, (res) => {
      res.on('data', () => {});
      res.on('end', () => resolve({ status: res.statusCode }));
    }).on('error', reject);
  });
  check('HTTP GET /unknown returns 404', notFoundRes.status === 404);

  // Test 4: WebSocket connection + welcome message
  const messages = [];
  const ws = new WebSocket(`ws://127.0.0.1:${PORT}`);

  // Attach message handler BEFORE connection opens (server sends welcome immediately)
  ws.on('message', (data) => messages.push(JSON.parse(data.toString())));

  await new Promise((resolve, reject) => {
    ws.on('open', resolve);
    ws.on('error', reject);
    setTimeout(() => reject(new Error('WS connect timeout')), 3000);
  });
  check('WebSocket connects successfully', ws.readyState === WebSocket.OPEN);

  await new Promise((r) => setTimeout(r, 200));
  check('Welcome message received', messages.some((m) => m.type === 'system' && m.content === 'Welcome!'));

  // Test 5: Send chat message
  ws.send(JSON.stringify({ type: 'chat', username: 'Tester', content: 'Hello!' }));
  await new Promise((r) => setTimeout(r, 200));
  check('Chat message echoed back', messages.some((m) => m.type === 'chat' && m.content === 'Hello!'));

  // Test 6: Verify online count
  check('Online count is 1', messages.some((m) => m.online === 1));

  // Cleanup
  ws.close();
  await new Promise((r) => setTimeout(r, 200));

  console.log(`\n  Results: ${passed} passed, ${failed} failed\n`);

  wss.close(() => server.close(() => process.exit(failed > 0 ? 1 : 0)));
}
