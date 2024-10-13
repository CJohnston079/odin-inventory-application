DROP TABLE IF EXISTS book_languages;
DROP TABLE IF EXISTS book_genres;
DROP TABLE IF EXISTS fact_books;
DROP TABLE IF EXISTS dim_countries;
DROP TABLE IF EXISTS dim_genres;
DROP TABLE IF EXISTS dim_authors;

CREATE TABLE IF NOT EXISTS dim_authors (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY (START WITH 101),
  slug VARCHAR(64),
  first_name VARCHAR(32),
  last_name VARCHAR(32),
  birth_year INT,
  nationality VARCHAR(32),
  biography VARCHAR(400)
);

CREATE TABLE IF NOT EXISTS dim_genres (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY (START WITH 101),
  slug VARCHAR(64),
  name VARCHAR(32),
  description VARCHAR(400)
);

CREATE TABLE IF NOT EXISTS dim_countries (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY (START WITH 101),
  slug VARCHAR(64),
  name VARCHAR(32),
  nationality VARCHAR(32),
  language VARCHAR(32)
);

CREATE TABLE IF NOT EXISTS fact_books (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY (START WITH 101),
  slug VARCHAR(128),
  author_id INT REFERENCES dim_authors(id),
  title VARCHAR(64),
  publication_year INT,
  is_fiction BOOLEAN,
  description VARCHAR(400)
);

CREATE TABLE IF NOT EXISTS book_genres (
  book_id INT REFERENCES fact_books(id),
  genre_id INT REFERENCES dim_genres(id),
  PRIMARY KEY (book_id, genre_id)
);

CREATE TABLE IF NOT EXISTS book_languages (
  book_id INT REFERENCES fact_books(id),
  country_id INT REFERENCES dim_countries(id),
  PRIMARY KEY (book_id, country_id)
);
