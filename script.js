const db = require('./db');
const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Default route
app.get('/', (req, res) => {
  res.send('✅ JobPrep Tracker backend is working!');
});

// Add a new problem
app.post("/add-problem", (req, res) => {
  const { title, solution } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  const query = 'INSERT INTO problems (title, solution) VALUES (?, ?)';
  db.query(query, [title, solution || ''], (err, result) => {
    if (err) {
      console.error('Error inserting:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    res.status(200).json({ message: 'Problem added!', id: result.insertId });
  });
});

// Get all problems
app.get('/problems', (req, res) => {
  const query = 'SELECT * FROM problems ORDER BY id DESC';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching problems:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    res.status(200).json(results);
  });
});

// Delete a problem
app.delete('/problem/:id', (req, res) => {
  const id = req.params.id;
  const query = 'DELETE FROM problems WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting problem:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    res.status(200).json({ message: 'Problem deleted!' });
  });
});

// ✅ NEW: Get single problem by ID
app.get('/problem/:id', (req, res) => {
  const id = req.params.id;
  const query = 'SELECT * FROM problems WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    res.status(200).json(results[0]);
  });
});

// ✅ NEW: Update solution
app.put('/problem/:id', (req, res) => {
  const id = req.params.id;
  const { solution } = req.body;

  console.log("Updating ID:", id);
  console.log("Solution:", solution);

  const query = 'UPDATE problems SET solution = ? WHERE id = ?';

  db.query(query, [solution, id], (err, result) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ message: 'Error updating solution' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Problem not found in DB' });
    }

    res.status(200).json({ message: 'Solution updated successfully!' });
  });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
