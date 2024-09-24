const pool = require("../pool");

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

exports.insertBook = async function (newBook) {
	const authorIdQuery = await pool.query(
		"SELECT author_id FROM dim_authors WHERE (first_name || ' ' || last_name) = $1",
		[newBook["author-name"]]
	);

	const authorId = authorIdQuery.rows[0].author_id;
	const category = newBook["isFiction"] ? "fiction" : "non-fiction";

	await pool.query(
		"INSERT INTO fact_books (book_title, author_id, publication_year, category) VALUES ($1, $2, $3, $4)",
		[newBook["title"], authorId, newBook["publication-year"], category]
	);

	const bookIdQuery = await pool.query("SELECT book_id FROM fact_books WHERE book_title = $1", [
		newBook["title"],
	]);

	if (!newBook["genres"]) {
		return;
	}

	const genres = newBook["genres"].split(", ");

	for (const genre of genres) {
		const genreIdQuery = await pool.query("SELECT genre_id FROM dim_genres WHERE genre_name = $1", [
			genre,
		]);

		const bookId = bookIdQuery.rows[0].book_id;
		const genreId = genreIdQuery.rows[0].genre_id;

		await pool.query("INSERT INTO book_genres (book_id, genre_id) VALUES ($1, $2)", [
			Number(bookId),
			Number(genreId),
		]);
	}
};
