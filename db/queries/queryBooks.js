const pool = require("../pool");

exports.getAllBooks = async function () {
	const { rows } = await pool.query(`
		SELECT
      fb.book_id,
      da.author_id,
      fb.book_title AS title,
      da.first_name || ' ' || da.last_name AS author,
      fb.publication_year,
      STRING_AGG(dg.genre_name, ',') AS genres
    FROM fact_books fb
    JOIN dim_authors da ON fb.author_id = da.author_id
    JOIN book_genres bg ON fb.book_id = bg.book_id
    JOIN dim_genres as dg ON bg.genre_id = dg.genre_id
    GROUP BY fb.book_id, da.author_id
    ORDER BY title;
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
    SELECT
      fb.book_id,
      da.author_id,
      fb.book_title AS title,
      da.first_name || ' ' || da.last_name AS author,
      fb.publication_year,
      STRING_AGG(dg.genre_name, ', ') AS genres
    FROM fact_books fb
    JOIN dim_authors da ON fb.author_id = da.author_id
    JOIN book_genres bg ON fb.book_id = bg.book_id
    JOIN dim_genres as dg ON bg.genre_id = dg.genre_id
    WHERE da.first_name || ' ' || da.last_name = $1
    GROUP BY fb.book_id, da.author_id
    ORDER BY title;
	`,
		[author]
	);
	return rows;
};

exports.getBooksByGenre = async function (genre) {
	const { rows } = await pool.query(
		`
    SELECT
      fb.book_id,
      da.author_id,
      fb.book_title AS title,
      da.first_name || ' ' || da.last_name AS author,
      fb.publication_year,
    STRING_AGG(dg.genre_name, ', ') AS genres
    FROM fact_books fb
    JOIN dim_authors da ON fb.author_id = da.author_id
    JOIN book_genres bg ON fb.book_id = bg.book_id
    JOIN dim_genres dg ON bg.genre_id = dg.genre_id
    WHERE fb.book_id IN (
      SELECT fb2.book_id
      FROM fact_books fb2
      JOIN book_genres bg2 ON fb2.book_id = bg2.book_id
      JOIN dim_genres dg2 ON bg2.genre_id = dg2.genre_id
      WHERE dg2.genre_name = $1
    )
    GROUP BY fb.book_id, da.author_id
    ORDER BY title
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

exports.getAllDecades = async function () {
	const { rows } = await pool.query(`
    SELECT 
      CONCAT(FLOOR(publication_year / 10) * 10, 's') AS decade,
      COUNT(*) AS number_of_books
    FROM fact_books
    GROUP BY decade
    ORDER BY decade DESC;
	`);
	return rows;
};

exports.getBooksByDecade = async function (decade) {
	const { rows } = await pool.query(
		`
    SELECT
      fb.book_id,
      da.author_id,
      fb.book_title AS title,
      da.first_name || ' ' || da.last_name AS author,
      fb.publication_year,
      STRING_AGG(dg.genre_name, ',') AS genres
    FROM fact_books fb
    JOIN dim_authors da ON fb.author_id = da.author_id
    JOIN book_genres bg ON fb.book_id = bg.book_id
    JOIN dim_genres as dg ON bg.genre_id = dg.genre_id
    WHERE fb.publication_year BETWEEN $1 AND $2
    GROUP BY fb.book_id, da.author_id
    ORDER BY title;
  `,
		[decade, decade + 9]
	);
	return rows;
};
