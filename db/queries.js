const pool = require("./pool");

async function getAllBooks() {
	const { rows } = await pool.query(`
		SELECT fb.*, da.first_name || ' ' || da.last_name AS author
    FROM fact_books fb
    JOIN dim_authors da ON fb.author_id = da.author_id;
	`);
	return rows;
}

async function getBooksByAuthor(author) {
	const { rows } = await pool.query(
		`
    SELECT fb.*, da.first_name || ' ' || da.last_name AS author
    FROM fact_books fb
    JOIN dim_authors da ON fb.author_id = da.author_id
    WHERE da.first_name || ' ' || da.last_name = $1;
	`,
		[author]
	);
	return rows;
}

async function getBooksByGenre(genre) {
	const { rows } = await pool.query(
		`
		SELECT fb.*, da.first_name || ' ' || da.last_name AS author
    FROM fact_books fb
    JOIN dim_authors da ON fb.author_id = da.author_id
    JOIN book_genres bg ON fb.book_id = bg.book_id
    JOIN dim_genres as dg ON bg.genre_id = dg.genre_id
    WHERE dg.genre_name = $1;
	`,
		[genre]
	);
	return rows;
}

async function getAllAuthors() {
	const { rows } = await pool.query(`
		SELECT first_name || ' ' || last_name AS author_name, slug FROM dim_authors;
	`);
	return rows;
}

async function getAuthorBySlug(slug) {
	const { rows } = await pool.query(
		`
  		SELECT first_name || ' ' || last_name AS author FROM dim_authors WHERE slug = $1;
  `,
		[slug]
	);
	return rows;
}

async function getAllGenres() {
	const { rows } = await pool.query(`
		SELECT genre_name AS genre FROM dim_genres;
	`);
	return rows;
}

module.exports = {
	getAllBooks,
	getBooksByAuthor,
	getBooksByGenre,
	getAllAuthors,
	getAuthorBySlug,
	getAllGenres,
};
