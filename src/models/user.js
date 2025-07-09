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

async function findById(id) {
  const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [id]);
  return rows[0];
}

async function setVerified(id) {
  await db.query('UPDATE users SET is_verified = TRUE WHERE id = $1', [id]);
}

module.exports = { create, findByEmail, findById, setVerified };
