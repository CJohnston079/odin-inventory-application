DROP TABLE IF EXISTS book_languages;
DROP TABLE IF EXISTS book_genres;
DROP TABLE IF EXISTS fact_books;
DROP TABLE IF EXISTS dim_languages;
DROP TABLE IF EXISTS dim_genres;
DROP TABLE IF EXISTS dim_authors;

CREATE TABLE IF NOT EXISTS dim_authors (
  author_id VARCHAR(64) PRIMARY KEY,
  first_name VARCHAR(32),
  last_name VARCHAR(32),
  date_of_birth DATE,
  nationality VARCHAR(32)
);

CREATE TABLE IF NOT EXISTS dim_genres (
  genre_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  genre_name VARCHAR(32),
  description TEXT
);

CREATE TABLE IF NOT EXISTS dim_languages (
  language_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  language_name VARCHAR(32)
);

CREATE TABLE IF NOT EXISTS fact_books (
  book_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  book_title VARCHAR(64),
  author_id VARCHAR(64) REFERENCES dim_authors(author_id),
  publication_year INT,
  category TEXT CHECK (category IN ('fiction', 'non-fiction'))
);

CREATE TABLE IF NOT EXISTS book_genres (
  book_id INT REFERENCES fact_books(book_id),
  genre_id INT REFERENCES dim_genres(genre_id),
  PRIMARY KEY (book_id, genre_id)
);

CREATE TABLE IF NOT EXISTS book_languages (
  book_id INT REFERENCES fact_books(book_id),
  language_id INT REFERENCES dim_languages(language_id),
  PRIMARY KEY (book_id, language_id)
);
