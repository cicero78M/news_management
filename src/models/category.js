const db = require('../db');

async function getAll() {
  const { rows } = await db.query('SELECT * FROM categories ORDER BY id');
  return rows;
}

async function create(name) {
  const { rows } = await db.query(
    'INSERT INTO categories (name) VALUES ($1) RETURNING *',
    [name]
  );
  return rows[0];
}

module.exports = { getAll, create };
