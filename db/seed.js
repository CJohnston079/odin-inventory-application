#! /usr/bin/env node

const { Client } = require("pg");
require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";
const sslConfig = isProduction ? "?sslmode=require" : "";

const SQL = `
CREATE TABLE IF NOT EXISTS dim_authors (
  author_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
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
  author_id INT REFERENCES dim_authors(author_id),
  publication_year INT CHECK (publication_year <= EXTRACT(YEAR FROM CURRENT_DATE)),
  category TEXT CHECK (category IN ('fiction', 'non-fiction'))
);

CREATE TABLE IF NOT EXISTS book_genres (
  PRIMARY KEY (book_id, genre_id),
  book_id INT REFERENCES fact_books(book_id),
  genre_id INT REFERENCES dim_genres(genre_id)
);

CREATE TABLE IF NOT EXISTS book_languages (
  PRIMARY KEY (book_id, language_id),
  book_id INT REFERENCES fact_books(book_id),
  language_id INT REFERENCES dim_languages(language_id)
);
`;

function getArgumentValue(flag, defaultValue) {
	const index = process.argv.indexOf(flag);
	return index > -1 ? process.argv[index + 1] : defaultValue;
}

async function main() {
	console.log("seeding...");

	const user = getArgumentValue("--user", process.env.USER);
	const password = getArgumentValue("--password", process.env.PASSWORD);
	const host = getArgumentValue("--host", process.env.HOST);
	const database = getArgumentValue("--database", process.env.DATABASE);

	const client = new Client({
		connectionString: `postgresql://${user}:${password}@${host}:5432/${database}${sslConfig}`,
		ssl: isProduction ? { rejectUnauthorized: false } : false,
	});
	await client.connect();
	await client.query(SQL);
	await client.end();
	console.log("seeding complete");
}

main();
