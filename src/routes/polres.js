const express = require('express');
const polresModel = require('../models/polres');
const auth = require('../authMiddleware');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const data = await polresModel.getAll();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

router.post('/', auth, async (req, res) => {
  const { name, website } = req.body;
  try {
    const polres = await polresModel.create(name, website);
    res.json(polres);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

module.exports = router;
