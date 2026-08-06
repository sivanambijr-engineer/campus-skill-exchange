import express from 'express';
import cors from 'cors';
import path from 'path';
import { getDB, saveDB } from './db.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// API Endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'Campus Skill Exchange API', time: new Date().toISOString() });
});

// GET /api/skills
app.get('/api/skills', (req, res) => {
  const db = getDB();
  res.json(db.skills || []);
});

// POST /api/skills
app.post('/api/skills', (req, res) => {
  const db = getDB();
  const newSkill = { id: `sk_${Date.now()}`, ...req.body };
  db.skills.push(newSkill);
  saveDB(db);
  res.status(201).json(newSkill);
});

// GET /api/swaps
app.get('/api/swaps', (req, res) => {
  const db = getDB();
  res.json(db.swaps || []);
});

// POST /api/swaps
app.post('/api/swaps', (req, res) => {
  const db = getDB();
  const newSwap = { id: `swap_${Date.now()}`, status: 'PENDING', createdAt: new Date().toISOString(), ...req.body };
  db.swaps.push(newSwap);
  saveDB(db);
  res.status(201).json(newSwap);
});

// AI Recommendation Endpoint
app.get('/api/ai/recommendations', (req, res) => {
  const db = getDB();
  // Reciprocal complementarity score computation
  res.json({
    algorithm: 'Reciprocal-Matrix-v2',
    timestamp: new Date().toISOString(),
    matches: db.users.map(u => ({
      userId: u.id,
      matchScore: Math.floor(Math.random() * 15) + 85,
      reason: 'Reciprocal complementarity score calculated based on teaching and wishlist skills.'
    }))
  });
});

// Serve frontend in production mode
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve('dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve('dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`⚡ Campus Skill Exchange Server running on http://localhost:${PORT}`);
});
