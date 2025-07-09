const express = require('express');
const articleModel = require('../models/article');

const router = express.Router({ mergeParams: true });

router.get('/', async (req, res) => {
  const { polresId } = req.params;
  try {
    const articles = await articleModel.byPolres(polresId);
    res.json(articles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

module.exports = router;
