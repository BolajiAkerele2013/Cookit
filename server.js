import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Enable CORS for all origins in development
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Initialize SQLite database
const db = new sqlite3.Database(join(__dirname, 'database.sqlite'), (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  db.serialize(() => {
    // Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        password TEXT NOT NULL,
        skills TEXT DEFAULT '[]',
        interests TEXT DEFAULT '[]',
        portfolio TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Ideas table
    db.run(`
      CREATE TABLE IF NOT EXISTS ideas (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        problem_category TEXT NOT NULL,
        solution TEXT NOT NULL,
        visibility TEXT DEFAULT 'private',
        owner_id TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (owner_id) REFERENCES users (id)
      )
    `);

    // User roles for ideas
    db.run(`
      CREATE TABLE IF NOT EXISTS idea_users (
        id TEXT PRIMARY KEY,
        idea_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        role TEXT NOT NULL,
        equity_percentage REAL,
        debt_amount REAL,
        start_date TEXT,
        end_date TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (idea_id) REFERENCES ideas (id),
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    console.log('Database tables initialized');
  });
}

// Test endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Auth routes
app.post('/api/auth/signup', (req, res) => {
  console.log('Signup request received:', req.body);
  const { email, password, name } = req.body;
  
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const id = Math.random().toString(36).substr(2, 9);

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Server error during signup' });
    }

    if (row) {
      return res.status(400).json({ error: 'User already exists' });
    }

    db.run(
      'INSERT INTO users (id, email, password, name, skills, interests) VALUES (?, ?, ?, ?, ?, ?)',
      [id, email, password, name, '[]', '[]'],
      (err) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Server error during signup' });
        }

        const token = Buffer.from(id).toString('base64');
        res.status(201).json({
          user: {
            id,
            email,
            name,
            skills: '[]',
            interests: '[]'
          },
          token
        });
      }
    );
  });
});

app.post('/api/auth/login', (req, res) => {
  console.log('Login request received:', req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Server error during login' });
    }

    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = Buffer.from(user.id).toString('base64');
    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, token });
  });
});

// Start server
const port = 3001;
const server = app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// Handle server errors
server.on('error', (error) => {
  console.error('Server error:', error);
});

// Cleanup on exit
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('Database connection closed');
    }
    server.close(() => {
      console.log('Server stopped');
      process.exit(0);
    });
  });
});
