const pool = require("../pool");

exports.insertBook = async function (newBook) {
	const { title, authorID, publicationYear, isFiction, genres } = newBook;

	try {
		await pool.query("BEGIN");

		const insertBookQuery = `
          INSERT INTO fact_books (book_title, author_id, publication_year, is_fiction)
          VALUES ($1, $2, $3, $4)
          RETURNING book_id
      `;
		const {
			rows: [{ book_id: bookID }],
		} = await pool.query(insertBookQuery, [title, authorID, publicationYear, isFiction]);

		if (genres && genres.length > 0) {
			const genreQuery = `
        INSERT INTO book_genres (book_id, genre_id)
        SELECT $1, genre_id FROM dim_genres
        WHERE genre_name = ANY($2)
      `;
			await pool.query(genreQuery, [bookID, genres]);
		}

		await pool.query("COMMIT");
		return bookID;
	} catch (error) {
		await pool.query("ROLLBACK");
		console.error(`Error inserting book ${title}:`, error);
		throw error;
	}
};

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
