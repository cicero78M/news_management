# News Management Backend

Backend sederhana berbasis Node.js untuk manajemen data dan pemberitaan jajaran Polda Jatim. Backend ini menyediakan API dasar untuk menyimpan data Polres, melakukan scraping berita dari website rekanan, serta menyimpan hasilnya pada database PostgreSQL. Versi ini menambahkan beberapa kolom pada tabel `articles` agar informasi seperti ringkasan berita, gambar utama, serta sumber media dapat tersimpan dengan lebih lengkap.

## Konfigurasi

Siapkan file `.env` berdasarkan contoh berikut:

```
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=password
PGDATABASE=newsdb
PORT=3000
JWT_SECRET=your_secret_key
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=username
SMTP_PASS=password
EMAIL_FROM=no-reply@example.com
```

Pastikan PostgreSQL berjalan dan database sesuai variabel `PGDATABASE` telah dibuat.

## Instalasi

```bash
npm install
```

## Menjalankan Server

```bash
npm start
```

Server akan berjalan pada port sesuai variabel `PORT`. Secara default scraping dijalankan setiap satu jam sekali.

## Struktur Database

```
CREATE TABLE polres (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  website TEXT NOT NULL
);

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE articles (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  link TEXT NOT NULL,
  content TEXT,
  summary TEXT,
  image_url TEXT,
  published_at TIMESTAMP,
  polres_id INTEGER REFERENCES polres(id),
  category_id INTEGER REFERENCES categories(id),
  author TEXT,
  source TEXT,
  comment_count INTEGER,
  share_count INTEGER,
  view_count INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE article_tags (
  article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id)
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  polres_id INTEGER REFERENCES polres(id),
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Tambahkan data Polres awal dengan API `POST /polres` atau langsung pada database.

## Scraping

Modul `src/scraper/scraper.js` memuat mekanisme scraping menggunakan `axios` dan `cheerio`. Selector bawaan bersifat generik sehingga mungkin perlu disesuaikan dengan struktur website berita masing-masing Polres agar hasil lebih optimal.
Selain judul dan tautan, scraper juga mencoba mengambil tanggal publikasi, ringkasan singkat, serta gambar utama apabila tersedia. Nilai lain seperti jumlah komentar atau share dapat diisi bila situs sumber menampilkannya.

## Rute API Singkat

- `GET /polres` – daftar Polres
- `POST /polres` – tambah Polres baru (`name`, `website`)
- `GET /polres/:polresId/articles` – daftar artikel milik Polres
- `GET /categories` – daftar kategori
- `POST /categories` – tambah kategori baru (`name`)
- `GET /tags` – daftar tag
- `POST /tags` – tambah tag baru (`name`)
- `POST /auth/register` – registrasi user baru (`email`, `password`, `polres_id`)
- `POST /auth/login` – login dan mendapatkan token
- `GET /auth/verify/:token` – verifikasi email pengguna

Frontend dapat menggunakan API ini sebagai dasar pengelolaan data pemberitaan.

## Verifikasi Email

Saat registrasi, backend akan mengirim email berisi tautan verifikasi ke alamat yang didaftarkan. Pengguna harus membuka tautan tersebut agar akun aktif dan dapat melakukan proses login.
