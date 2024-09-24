const pool = require("../pool");

exports.getGenreNames = async function () {
	const { rows } = await pool.query(`
    SELECT
      genre_id AS id,
      genre_name
    FROM dim_genres
    ORDER BY genre_name
	`);
	return rows;
};

exports.getAllGenres = async function () {
	const { rows } = await pool.query(`
		SELECT
      dg.genre_name AS genre,
      COALESCE(COUNT(fb.book_id), 0) AS number_of_books
    FROM dim_genres dg
    LEFT JOIN book_genres bg ON dg.genre_id = bg.genre_id
    LEFT JOIN fact_books fb ON bg.book_id = fb.book_id
    GROUP BY genre
    ORDER BY genre;
	`);
	return rows;
};

exports.insertGenre = async function (newGenre) {
	const genreName = newGenre["genre-name"];
	const genreDescription = newGenre["genre-description"];

	await pool.query("INSERT INTO dim_genres (genre_name, description) VALUES($1, $2)", [
		genreName,
		genreDescription,
	]);
};
