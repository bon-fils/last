const express = require('express');
const router = express.Router();
const db = require('./db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const SECRET_KEY = 'abefghijklmnopqrstuvwxyz1_234567890jdfyhgtuasjgfdsbfeadbmfjdfbvchjdbv_edhs';

// Register user
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `INSERT INTO userz (username, password) VALUES (?, ?)`;

    db.run(query, [username, hashedPassword], function (err) {
      if (err) {
        console.error(err.message);
        return res.status(400).json({ message: 'User already exists or error occurred' });
      }
      res.json({ message: 'User registered successfully', userId: this.lastID });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login user
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  const query = `SELECT * FROM userz WHERE username = ?`;

  db.get(query, [username], async (err, user) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ message: 'Database error' });
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '72h' });
    res.json({ token });
  });
});

module.exports = router;
