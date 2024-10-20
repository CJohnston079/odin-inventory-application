const pool = require("../pool");
const logger = require("../../js/logger");

exports.insertGenre = async function (newGenre) {
	try {
		await pool.query(
			"INSERT INTO dim_genres (slug, name, description) VALUES ($1, $2, $3)",
			Object.values(newGenre.toDbEntry())
		);
	} catch (err) {
		logger.error(`Error inserting genre ${JSON.stringify(newGenre, null, 2)}.`, err);
		throw err;
	}
};

exports.checkGenre = async function (genreName) {
	const query = `
		SELECT 1 FROM dim_genres
		WHERE name = $1
		LIMIT 1;
	`;

	const result = await pool.query(query, [genreName]);
	const genreExists = result.rowCount > 0;

	return genreExists;
};

exports.getGenreNames = async function () {
	const { rows } = await pool.query(`
    SELECT
      id,
      name
    FROM dim_genres
    ORDER BY name
	`);
	return rows;
};

exports.getAllGenres = async function () {
	const { rows } = await pool.query(`
		SELECT
      genre.id,
      genre.name,
      COALESCE(COUNT(book.id), 0) AS number_of_books
    FROM dim_genres AS genre
    LEFT JOIN book_genres AS bg ON genre.id = bg.genre_id
    LEFT JOIN fact_books AS book ON bg.book_id = book.id
    GROUP BY genre.id
    ORDER BY genre.name;
	`);
	return rows;
};

exports.getGenresByBook = async function (book) {
	const { rows } = await pool.query(
		`
    SELECT
      genre.id,
      genre.slug,
      genre.name
    FROM dim_genres AS genre
    JOIN book_genres AS bg ON genre.id = bg.genre_id
    JOIN fact_books AS book ON bg.book_id = book.id
    WHERE book.id = $1;
  `,
		[book]
	);
	return rows;
};

exports.getGenresByAuthor = async function (author) {
	const { rows } = await pool.query(
		`
    SELECT
      genre.id, 
      genre.slug,
      genre.name
    FROM dim_genres AS genre
    JOIN book_genres AS bg ON genre.id = bg.genre_id
    JOIN fact_books AS book ON bg.book_id = book.id
    JOIN dim_authors AS author ON book.author_id = author.id
    WHERE author.id = $1
    GROUP BY genre.id
    ORDER BY COUNT(genre.id) DESC, genre.name;
  `,
		[author]
	);
	return rows;
};

exports.getGenreByID = async function (id) {
	const { rows } = await pool.query(
		`SELECT id, name, slug, description FROM dim_genres WHERE id = $1;`,
		[id]
	);
	return rows;
};

exports.deleteGenre = async function (genre) {
	try {
		await pool.query("BEGIN");
		await pool.query("DELETE FROM book_genres WHERE genre_id = $1;", [genre]);
		await pool.query("DELETE FROM dim_genres WHERE id = $1;", [genre]);
		await pool.query("COMMIT");
	} catch (error) {
		await pool.query("ROLLBACK");
		throw error;
	}
};
