const pool = require("../pool");

exports.insertGenre = async function (newGenre) {
	const { name, description } = newGenre;

	const query = "INSERT INTO dim_genres (name, description) VALUES($1, $2)";

	try {
		await pool.query(query, [name, description]);
	} catch (error) {
		console.error(`Error inserting genre ${name}.`, error);
		throw error;
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

exports.getGenreByID = async function (id) {
	const { rows } = await pool.query(`SELECT name AS genre FROM dim_genres WHERE id = $1;`, [id]);
	return rows;
};
