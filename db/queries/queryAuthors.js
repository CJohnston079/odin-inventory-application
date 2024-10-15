const pool = require("../pool");

exports.insertAuthor = async function (newAuthor) {
	try {
		await newAuthor.fetchCountryID();

		await pool.query(
			`
      INSERT INTO dim_authors (country_id, slug, first_name, last_name, birth_year, biography)
      VALUES ($1, $2, $3, $4, $5, $6)
      `,
			Object.values(newAuthor.toDbEntry())
		);
	} catch (err) {
		console.error(`Error inserting author ${newAuthor}.`, err);
		throw err;
	}
};

exports.checkAuthor = async function (slug) {
	console.log(slug);
	const query = `
		SELECT 1 FROM dim_authors
		WHERE slug = $1
		LIMIT 1;
	`;

	const result = await pool.query(query, [slug]);
	const authorExists = result.rowCount > 0;

	return authorExists;
};

exports.getAuthorNames = async function () {
	const { rows } = await pool.query(`
    SELECT
      id,
      first_name || ' ' || last_name AS name
    FROM dim_authors
    ORDER BY last_name;
  `);
	return rows;
};

exports.getAllAuthors = async function () {
	const { rows } = await pool.query(`
    WITH GenreCounts AS (
      SELECT
        book.author_id,
        genre.name,
        COUNT(DISTINCT book.id) AS genre_count
      FROM fact_books AS book
      JOIN book_genres AS bg ON book.id = bg.book_id
      JOIN dim_genres AS genre ON bg.genre_id = genre.id
      GROUP BY book.author_id, genre.id
    )
    SELECT
      author.id,
      author.first_name || ' ' || author.last_name AS name,
      author.birth_year,
      country.nationality,
      country.name AS country,
      COALESCE((
        SELECT STRING_AGG(gc.name, ',' ORDER BY gc.genre_count DESC, gc.name)
        FROM GenreCounts AS gc
        WHERE gc.author_id = author.id
      ), '') AS genres,
      COUNT(DISTINCT book.id) AS number_of_books
    FROM dim_authors AS author
    LEFT JOIN fact_books AS book ON author.id = book.author_id
    JOIN dim_countries AS country ON author.country_id = country.id
    GROUP BY author.id, country.id
    ORDER BY author.last_name;
	`);
	return rows;
};

exports.getAuthorByID = async function (id) {
	const { rows } = await pool.query(
		`
  		SELECT first_name || ' ' || last_name AS author FROM dim_authors WHERE id = $1;
  `,
		[id]
	);
	return rows;
};

exports.getAuthorIDByName = async function (name) {
	const { rows } = await pool.query(
		`
      SELECT id FROM dim_authors WHERE first_name || ' ' || last_name = $1;
    `,
		[name]
	);
	return rows[0].id;
};
