const db = require('../db');

async function create(email, passwordHash, polres_id) {
  const { rows } = await db.query(
    'INSERT INTO users (email, password, polres_id) VALUES ($1, $2, $3) RETURNING *',
    [email, passwordHash, polres_id]
  );
  return rows[0];
}

async function findByEmail(email) {
  const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  return rows[0];
}

module.exports = { create, findByEmail };
