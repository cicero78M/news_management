const db = require('../db');

async function getAll() {
  const { rows } = await db.query('SELECT * FROM polres ORDER BY id');
  return rows;
}

async function create(name, website) {
  const { rows } = await db.query(
    'INSERT INTO polres (name, website) VALUES ($1, $2) RETURNING *',
    [name, website]
  );
  return rows[0];
}

module.exports = { getAll, create };
