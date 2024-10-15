const pool = require("../pool");

exports.insertBook = async function (newBook) {
	try {
		await pool.query("BEGIN");
		await newBook.fetchAuthorID();
		const result = await pool.query(
			`
      INSERT INTO fact_books (author_id, slug, title, publication_year, is_fiction, description)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING fact_books.id
      `,
			Object.values(newBook.toDbEntry())
		);

		const bookID = result.rows[0].id;
		const genres = newBook.genres;

		if (genres && genres.length > 0) {
			const genreQuery = `
        INSERT INTO book_genres (book_id, genre_id)
        SELECT $1, id FROM dim_genres AS genre
        WHERE genre.name = ANY($2)
      `;
			await pool.query(genreQuery, [bookID, genres]);
		}

		await pool.query("COMMIT");
		return bookID;
	} catch (err) {
		await pool.query("ROLLBACK");
		console.error(`Error inserting book ${newBook}.`, err);
		throw err;
	}
};

exports.checkBookTitle = async function (title, authorID) {
	const query = `
		SELECT 1
    FROM fact_books AS book
    JOIN dim_authors AS author ON book.author_id = author.id
		WHERE book.title = $1
      AND author.slug = $2
		LIMIT 1;
	`;

	const result = await pool.query(query, [title, authorID]);
	const titleExists = result.rowCount > 0;

	return titleExists;
};

exports.getAllBooks = async function () {
	const { rows } = await pool.query(`
		SELECT
      book.id,
      book.author_id,
      book.slug,
      author.slug AS author_slug,
      book.title,
      author.first_name || ' ' || author.last_name AS author,
      book.publication_year,
      STRING_AGG(genre.name, ',') AS genres
    FROM fact_books AS book
    JOIN dim_authors AS author ON book.author_id = author.id
    JOIN book_genres AS bg ON book.id = bg.book_id
    JOIN dim_genres AS genre ON bg.genre_id = genre.id
    GROUP BY book.id, author.id
    ORDER BY book.title, author;
	`);
	return rows;
};

exports.getBook = async function (bookID) {
	const { rows } = await pool.query(
		`
		SELECT
      book.*,
      author.first_name || ' ' || author.last_name AS author
    FROM fact_books AS book
    JOIN dim_authors AS author ON book.author_id = author.id
    WHERE book.id = $1;
  `,
		[bookID]
	);
	return rows;
};

exports.getBooksByAuthor = async function (author) {
	const { rows } = await pool.query(
		`
    SELECT
      book.id,
      book.author_id,
      book.slug,
      author.slug AS author_slug,
      book.title,
      author.first_name || ' ' || author.last_name AS author,
      book.publication_year,
      STRING_AGG(genre.name, ', ') AS genres
    FROM fact_books AS book
    JOIN dim_authors AS author ON book.author_id = author.id
    LEFT JOIN book_genres AS bg ON book.id = bg.book_id
    LEFT JOIN dim_genres AS genre ON bg.genre_id = genre.id
    WHERE author.first_name || ' ' || author.last_name = $1
    GROUP BY book.id, author.id
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
      book.id,
      book.author_id,
      author.slug AS author_slug,
      book.slug,
      book.title,
      author.first_name || ' ' || author.last_name AS author,
      book.publication_year,
    STRING_AGG(genre.name, ', ') AS genres
    FROM fact_books AS book
    JOIN dim_authors AS author ON book.author_id = author.id
    JOIN book_genres AS bg ON book.id = bg.book_id
    JOIN dim_genres AS genre ON bg.genre_id = genre.id
    WHERE book.id IN (
      SELECT book2.id
      FROM fact_books AS book2
      JOIN book_genres AS bg2 ON book2.id = bg2.book_id
      JOIN dim_genres AS genre2 ON bg2.genre_id = genre2.id
      WHERE genre2.name = $1
    )
    GROUP BY book.id, author.id
    ORDER BY book.title, author
	`,
		[genre]
	);
	return rows;
};

exports.getAllDecades = async function () {
	const { rows } = await pool.query(`
    SELECT 
      FLOOR(publication_year / 10) * 10 AS decade,
      COUNT(*) AS number_of_books
    FROM fact_books
    GROUP BY decade
    ORDER BY decade;
	`);
	return rows;
};

exports.getBooksByDecade = async function (decade) {
	const { rows } = await pool.query(
		`
    SELECT
      book.id,
      book.author_id,
      book.slug,
      author.slug AS author_slug,
      author.first_name || ' ' || author.last_name AS author,
      book.title AS title,
      book.publication_year,
      STRING_AGG(genre.name, ',') AS genres
    FROM fact_books AS book
    JOIN dim_authors AS author ON book.author_id = author.id
    LEFT JOIN book_genres AS bg ON book.id = bg.book_id
    LEFT JOIN dim_genres AS genre ON bg.genre_id = genre.id
    WHERE book.publication_year BETWEEN $1 AND $2
    GROUP BY book.id, author.id
    ORDER BY book.title, author;
  `,
		[decade, decade + 9]
	);
	return rows;
};

exports.getBooksByCountry = async function (country) {
	const { rows } = await pool.query(
		`
    SELECT
      book.id,
      book.author_id,
      book.slug,
      author.slug AS author_slug,
      author.first_name || ' ' || author.last_name AS author,
      book.title,
      book.publication_year,
      STRING_AGG(genre.name, ',') AS genres
    FROM fact_books AS book
    JOIN dim_authors AS author ON book.author_id = author.id
    LEFT JOIN book_genres AS bg ON book.id = bg.book_id
    LEFT JOIN dim_genres AS genre ON bg.genre_id = genre.id
    JOIN dim_countries AS country ON author.country_id = country.id
    WHERE country.id = $1
    GROUP BY book.id, author.id
    ORDER BY book.title, author;
  `,
		[country]
	);
	return rows;
};
