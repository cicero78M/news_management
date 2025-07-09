const db = require('../db');

async function create(data) {
  const {
    title,
    link,
    content,
    published_at,
    polres_id,
    category_id,
    author,
  } = data;
  const { rows } = await db.query(
    `INSERT INTO articles (title, link, content, published_at, polres_id, category_id, author)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [title, link, content, published_at, polres_id, category_id, author]
  );
  return rows[0];
}

async function byPolres(polres_id) {
  const { rows } = await db.query(
    'SELECT * FROM articles WHERE polres_id = $1 ORDER BY published_at DESC',
    [polres_id]
  );
  return rows;
}

module.exports = { create, byPolres };
