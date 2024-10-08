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
  birth_year INT,
  nationality VARCHAR(32),
  biography VARCHAR(400)
);

CREATE TABLE IF NOT EXISTS dim_genres (
  genre_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  genre_name VARCHAR(32),
  description TEXT
);

CREATE TABLE IF NOT EXISTS dim_countries (
  country_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  country_name VARCHAR(32),
  nationality VARCHAR(32),
  language_name VARCHAR(32)
);

CREATE TABLE IF NOT EXISTS fact_books (
  book_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  book_title VARCHAR(64),
  author_id VARCHAR(64) REFERENCES dim_authors(author_id),
  publication_year INT,
  is_fiction BOOLEAN,
  book_description VARCHAR(400)
);

CREATE TABLE IF NOT EXISTS book_genres (
  book_id INT REFERENCES fact_books(book_id),
  genre_id INT REFERENCES dim_genres(genre_id),
  PRIMARY KEY (book_id, genre_id)
);

CREATE TABLE IF NOT EXISTS book_languages (
  book_id INT REFERENCES fact_books(book_id),
  country_id INT REFERENCES dim_countries(country_id),
  PRIMARY KEY (book_id, country_id)
);
