INSERT INTO polres (name, website) VALUES
('Polres Surabaya', 'https://www.polrestabesurabaya.net'),
('Polres Malang', 'https://www.polresmalangnews.com');

INSERT INTO categories (name) VALUES
('Umum'),
('Kriminal'),
('Humas');

INSERT INTO tags (name) VALUES
('Breaking'),
('Internal'),
('PressRelease');

INSERT INTO users (email, password, polres_id) VALUES
('admin@surabaya.polri', '$2b$10$wmqAzDR3bkXFt8tNMarEqOQgWtD4qkZt1krN5lRaH9WJORc4w2udy', 1);
