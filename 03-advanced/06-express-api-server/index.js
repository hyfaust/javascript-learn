/**
 * Express RESTful API Server - Main Entry
 *
 * Core concepts:
 * - Express application setup
 * - Middleware registration
 * - Route mounting
 * - Error handling
 * - Server startup
 */

const express = require('express');
const notesRouter = require('./routes/notes');
const errorHandler = require('./middleware/errorHandler');

// === 1. Create Express Application ===
const app = express();
const PORT = process.env.PORT || 3000;

// === 2. Built-in Middleware ===
// Parse JSON request bodies
app.use(express.json());

// Simple request logger
app.use((req, res, next) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// === 3. Routes ===
// Root route - API info
app.get('/', (req, res) => {
  res.json({
    name: 'Notes API',
    version: '1.0.0',
    endpoints: {
      'GET /api/notes': 'Get all notes',
      'GET /api/notes/:id': 'Get a single note',
      'POST /api/notes': 'Create a new note',
      'PUT /api/notes/:id': 'Update a note',
      'DELETE /api/notes/:id': 'Delete a note',
    },
  });
});

// Mount notes router
app.use('/api/notes', notesRouter);

// === 4. 404 Handler ===
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.url}`,
  });
});

// === 5. Error Handler ===
app.use(errorHandler);

// === 6. Start Server ===
app.listen(PORT, () => {
  console.log(`Notes API server running at http://localhost:${PORT}`);
  console.log('Press Ctrl+C to stop');
});
