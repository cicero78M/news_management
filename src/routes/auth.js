const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  const { email, password, polres_id } = req.body;
  if (!email || !password || !polres_id) {
    return res.status(400).json({ error: 'missing_fields' });
  }
  try {
    const existing = await userModel.findByEmail(email);
    if (existing) return res.status(400).json({ error: 'email_exists' });
    const hash = await bcrypt.hash(password, 10);
    const user = await userModel.create(email, hash, polres_id);
    res.json({ id: user.id, email: user.email, polres_id: user.polres_id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findByEmail(email);
    if (!user) return res.status(401).json({ error: 'invalid_credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'invalid_credentials' });
    const token = jwt.sign({ id: user.id, polres_id: user.polres_id }, process.env.JWT_SECRET || 'secret');
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

module.exports = router;
