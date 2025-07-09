const express = require('express');
const tagModel = require('../models/tag');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const data = await tagModel.getAll();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

router.post('/', async (req, res) => {
  const { name } = req.body;
  try {
    const tag = await tagModel.create(name);
    res.json(tag);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

module.exports = router;
