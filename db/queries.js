const pool = require("./pool");

async function getAllBooks() {
	const { rows } = await pool.query(`
		SELECT fb.*, da.first_name || ' ' || da.last_name AS author
    FROM fact_books fb
    JOIN dim_authors da ON fb.author_id = da.author_id;
	`);
	return rows;
}

async function getBook(bookID) {
	const { rows } = await pool.query(
		`
		SELECT fb.*, da.first_name || ' ' || da.last_name AS author
    FROM fact_books fb
    JOIN dim_authors da ON fb.author_id = da.author_id
    WHERE book_id = $1;
  `,
		[bookID]
	);
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
		SELECT
      da.first_name || ' ' || da.last_name AS author_name,
      COUNT(fb.book_id) AS number_of_books,
      da.slug
    FROM dim_authors da
    JOIN fact_books fb ON da.author_id = fb.author_id
    GROUP BY da.first_name, da.last_name, da.slug
    ORDER BY da.last_name;
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
		SELECT
      dg.genre_name AS genre,
      COALESCE(COUNT(fb.book_id), 0) AS number_of_books
    FROM dim_genres dg
    LEFT JOIN book_genres bg ON dg.genre_id = bg.genre_id
    LEFT JOIN fact_books fb ON bg.book_id = fb.book_id
    GROUP BY dg.genre_name
    ORDER BY dg.genre_name;
	`);
	return rows;
}

module.exports = {
	getAllBooks,
	getBook,
	getBooksByAuthor,
	getBooksByGenre,
	getAllAuthors,
	getAuthorBySlug,
	getAllGenres,
};
