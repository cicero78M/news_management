const express = require('express');
const categoryModel = require('../models/category');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const data = await categoryModel.getAll();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

router.post('/', async (req, res) => {
  const { name } = req.body;
  try {
    const category = await categoryModel.create(name);
    res.json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

module.exports = router;
