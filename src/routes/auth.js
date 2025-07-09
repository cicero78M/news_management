const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const userModel = require('../models/user');

const router = express.Router();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

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

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '1d',
    });
    const verifyUrl = `${req.protocol}://${req.get('host')}/auth/verify/${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Verifikasi Akun',
      text: `Klik tautan berikut untuk verifikasi akun: ${verifyUrl}`,
    });

    res.json({ message: 'verification_sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

router.get('/verify/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    await userModel.setVerified(payload.id);
    res.send('Email berhasil diverifikasi');
  } catch (err) {
    console.error(err);
    res.status(400).send('Invalid token');
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findByEmail(email);
    if (!user) return res.status(401).json({ error: 'invalid_credentials' });
    if (!user.is_verified) return res.status(401).json({ error: 'email_not_verified' });
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
