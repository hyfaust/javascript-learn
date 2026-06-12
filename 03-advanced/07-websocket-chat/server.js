/**
 * WebSocket Chat Server
 *
 * Core concepts:
 * - WebSocket protocol
 * - ws library API
 * - Event-driven programming (connection, message, close)
 * - Broadcasting messages to all clients
 * - HTTP server + WebSocket upgrade
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { WebSocketServer } = require('ws');

// === 1. HTTP Server (serves the client page) ===
const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/index.html') {
    const filePath = path.join(__dirname, 'index.html');
    const content = fs.readFileSync(filePath, 'utf-8');
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(content);
  } else if (req.url === '/style.css') {
    const filePath = path.join(__dirname, 'style.css');
    const content = fs.readFileSync(filePath, 'utf-8');
    res.writeHead(200, { 'Content-Type': 'text/css; charset=utf-8' });
    res.end(content);
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

// === 2. WebSocket Server (attached to HTTP server) ===
const wss = new WebSocketServer({ server });

// Track connected clients
const clients = new Set();

// Broadcast message to all connected clients
function broadcast(message) {
  const data = JSON.stringify(message);
  for (const client of clients) {
    if (client.readyState === 1) {
      // WebSocket.OPEN
      client.send(data);
    }
  }
}

wss.on('connection', (ws, req) => {
  clients.add(ws);
  console.log(`Client connected. Total: ${clients.size}`);

  // Send welcome message to the new client
  ws.send(
    JSON.stringify({
      type: 'system',
      content: 'Welcome to the chat room! Type a message to start chatting.',
      online: clients.size,
    })
  );

  // Broadcast user joined
  broadcast({
    type: 'system',
    content: `A new user joined the chat (${clients.size} online)`,
    online: clients.size,
  });

  // Handle incoming messages
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());

      if (message.type === 'chat' && message.content) {
        // Broadcast chat message to all clients
        broadcast({
          type: 'chat',
          username: message.username || 'Anonymous',
          content: message.content,
          timestamp: new Date().toLocaleTimeString(),
        });
      }
    } catch (err) {
      console.error('Invalid message format:', err.message);
    }
  });

  // Handle client disconnect
  ws.on('close', () => {
    clients.delete(ws);
    console.log(`Client disconnected. Total: ${clients.size}`);

    broadcast({
      type: 'system',
      content: `A user left the chat (${clients.size} online)`,
      online: clients.size,
    });
  });

  // Handle errors
  ws.on('error', (err) => {
    console.error('WebSocket error:', err.message);
    clients.delete(ws);
  });
});

// === 3. Start Server ===
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Chat server running at http://localhost:${PORT}`);
  console.log('Open the URL in multiple browser tabs to test');
  console.log('Press Ctrl+C to stop');
});
