CREATE TABLE IF NOT EXISTS polres (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  website TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS articles (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  link TEXT NOT NULL,
  content TEXT,
  published_at TIMESTAMP,
  polres_id INTEGER REFERENCES polres(id)
);
