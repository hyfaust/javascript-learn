/**
 * Notes Router - CRUD operations for notes
 *
 * Core concepts:
 * - Express Router
 * - HTTP methods (GET, POST, PUT, DELETE)
 * - Request params, body, query
 * - Status codes
 */

const express = require('express');
const router = express.Router();

// In-memory data store (replaced by database in production)
let notes = [
  { id: 1, title: 'Learn Express', content: 'Express is a minimal Node.js web framework', createdAt: new Date().toISOString() },
  { id: 2, title: 'Learn REST API', content: 'REST uses HTTP methods for CRUD operations', createdAt: new Date().toISOString() },
  { id: 3, title: 'Learn Middleware', content: 'Middleware functions have access to req, res, and next', createdAt: new Date().toISOString() },
];

let nextId = 4;

// GET /api/notes - Get all notes (with optional search)
router.get('/', (req, res) => {
  const { keyword } = req.query;

  let result = notes;

  // Filter by keyword if provided
  if (keyword) {
    const lowerKeyword = keyword.toLowerCase();
    result = notes.filter(
      (note) =>
        note.title.toLowerCase().includes(lowerKeyword) ||
        note.content.toLowerCase().includes(lowerKeyword)
    );
  }

  res.json({
    total: result.length,
    data: result,
  });
});

// GET /api/notes/:id - Get a single note
router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  const note = notes.find((n) => n.id === id);

  if (!note) {
    return res.status(404).json({
      error: 'Not Found',
      message: `Note with id ${id} not found`,
    });
  }

  res.json({ data: note });
});

// POST /api/notes - Create a new note
router.post('/', (req, res) => {
  const { title, content } = req.body;

  // Validation
  if (!title || !content) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Both title and content are required',
    });
  }

  const note = {
    id: nextId++,
    title,
    content,
    createdAt: new Date().toISOString(),
  };

  notes.push(note);

  res.status(201).json({
    message: 'Note created successfully',
    data: note,
  });
});

// PUT /api/notes/:id - Update a note
router.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = notes.findIndex((n) => n.id === id);

  if (index === -1) {
    return res.status(404).json({
      error: 'Not Found',
      message: `Note with id ${id} not found`,
    });
  }

  const { title, content } = req.body;

  // Partial update: only update provided fields
  if (title !== undefined) notes[index].title = title;
  if (content !== undefined) notes[index].content = content;
  notes[index].updatedAt = new Date().toISOString();

  res.json({
    message: 'Note updated successfully',
    data: notes[index],
  });
});

// DELETE /api/notes/:id - Delete a note
router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = notes.findIndex((n) => n.id === id);

  if (index === -1) {
    return res.status(404).json({
      error: 'Not Found',
      message: `Note with id ${id} not found`,
    });
  }

  const deleted = notes.splice(index, 1)[0];

  res.json({
    message: 'Note deleted successfully',
    data: deleted,
  });
});

module.exports = router;
