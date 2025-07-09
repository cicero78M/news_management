# News Management Backend

Backend sederhana berbasis Node.js untuk manajemen data dan pemberitaan jajaran Polda Jatim. Backend ini menyediakan API dasar untuk menyimpan data Polres, melakukan scraping berita dari website rekanan, serta menyimpan hasilnya pada database PostgreSQL. Struktur tabel artikel kini dilengkapi kolom tambahan seperti ringkasan, kategori, tag, gambar utama, dan lainnya.

## Konfigurasi

Siapkan file `.env` berdasarkan contoh berikut:

```
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=password
PGDATABASE=newsdb
PORT=3000
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

CREATE TABLE articles (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  link TEXT NOT NULL,
  content TEXT,
  summary TEXT,
  published_at TIMESTAMP,
  source TEXT,
  category TEXT,
  tags TEXT[],
  image_url TEXT,
  author TEXT,
  comments INTEGER,
  shares INTEGER,
  views INTEGER,
  polres_id INTEGER REFERENCES polres(id)
);
```

Tambahkan data Polres awal dengan API `POST /polres` atau langsung pada database.

## Scraping

Modul `src/scraper/scraper.js` memuat mekanisme scraping menggunakan `axios` dan `cheerio`. Selector bawaan bersifat generik sehingga mungkin perlu disesuaikan dengan struktur website berita masing-masing Polres agar hasil lebih optimal.

Saat men-scrape, sistem akan mencoba mengambil informasi tambahan dari halaman
berita seperti ringkasan, kategori, tag, gambar utama, serta nama penulis.

## Rute API Singkat

- `GET /polres` – daftar Polres
- `POST /polres` – tambah Polres baru (`name`, `website`)
- `GET /polres/:polresId/articles` – daftar artikel milik Polres

Frontend dapat menggunakan API ini sebagai dasar pengelolaan data pemberitaan.
