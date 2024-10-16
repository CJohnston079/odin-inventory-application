const pool = require("../pool");

exports.insertGenre = async function (newGenre) {
	try {
		await pool.query(
			"INSERT INTO dim_genres (slug, name, description) VALUES ($1, $2, $3)",
			Object.values(newGenre.toDbEntry())
		);
	} catch (err) {
		console.error(`Error inserting genre ${newGenre}.`, err);
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
    WHERE book.ID = $1;
  `,
		[book]
	);
	return rows;
};

exports.getGenreByID = async function (id) {
	const { rows } = await pool.query(`SELECT name AS genre FROM dim_genres WHERE id = $1;`, [id]);
	return rows;
};
