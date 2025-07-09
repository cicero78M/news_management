const db = require('../db');

async function create(data) {
  const {
    title,
    link,
    content,
    summary,
    published_at,
    source,
    category,
    tags,
    image_url,
    author,
    comments,
    shares,
    views,
    polres_id
  } = data;
  const { rows } = await db.query(
    `INSERT INTO articles (
      title, link, content, summary, published_at, source,
      category, tags, image_url, author, comments, shares, views, polres_id
     ) VALUES (
      $1, $2, $3, $4, $5, $6,
      $7, $8, $9, $10, $11, $12, $13, $14
     ) RETURNING *`,
    [
      title,
      link,
      content,
      summary,
      published_at,
      source,
      category,
      tags,
      image_url,
      author,
      comments,
      shares,
      views,
      polres_id
    ]
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
