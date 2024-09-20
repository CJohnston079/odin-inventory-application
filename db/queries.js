const pool = require("./pool");

exports.getAllBooks = async function () {
	const { rows } = await pool.query(`
		SELECT fb.*, da.first_name || ' ' || da.last_name AS author
    FROM fact_books fb
    JOIN dim_authors da ON fb.author_id = da.author_id;
	`);
	return rows;
};

exports.getBook = async function (bookID) {
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
};

exports.getBooksByAuthor = async function (author) {
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
};

exports.getBooksByGenre = async function (genre) {
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
};

exports.getAuthorNames = async function () {
	const { rows } = await pool.query(`
    SELECT
      author_id AS id,
      first_name || ' ' || last_name AS name
    FROM dim_authors
    ORDER BY last_name;
  `);
	return rows;
};

exports.getGenreNames = async function () {
	const { rows } = await pool.query(`
    SELECT
      genre_id AS id,
      genre_name AS name
    FROM dim_genres
    ORDER BY genre_name
	`);
	return rows;
};

exports.getAllAuthors = async function () {
	const { rows } = await pool.query(`
		SELECT
      da.first_name || ' ' || da.last_name AS author_name,
      COUNT(fb.book_id) AS number_of_books,
      da.author_id
    FROM dim_authors da
    JOIN fact_books fb ON da.author_id = fb.author_id
    GROUP BY da.first_name, da.last_name, da.author_id
    ORDER BY da.last_name;
	`);
	return rows;
};

exports.getAuthorByID = async function (id) {
	const { rows } = await pool.query(
		`
  		SELECT first_name || ' ' || last_name AS author FROM dim_authors WHERE author_id = $1;
  `,
		[id]
	);
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
    GROUP BY dg.genre_name
    ORDER BY dg.genre_name;
	`);
	return rows;
};
