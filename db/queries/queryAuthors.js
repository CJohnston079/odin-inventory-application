const pool = require("../pool");
const logger = require("../../js/logger");

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
		logger.error(`Error inserting author ${JSON.stringify(newAuthor, null, 2)}.`, err);
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
    SELECT
      author.id,
      country.id AS country_id,
      author.slug,
      country.slug AS country_slug,
      author.first_name || ' ' || author.last_name AS name,
      author.birth_year,
      country.nationality,
      country.name AS country,
      COUNT(DISTINCT book.id) AS number_of_books
    FROM dim_authors AS author
    LEFT JOIN fact_books AS book ON author.id = book.author_id
    JOIN dim_countries AS country ON author.country_id = country.id
    GROUP BY author.id, country.id
    ORDER BY (
      CASE
        WHEN LOWER(SPLIT_PART(author.last_name, ' ', 1)) IN ('al', 'bin', 'bint', 'da', 'de', 'del', 'della', 'di', 'dos', 'du', 'ibn', 'la', 'las', 'le', 'los', 'van', 'vom', 'von', 'zu')
        THEN SPLIT_PART(author.last_name, ' ', 2)
        ELSE unaccent(author.last_name)
      END
    );
	`);
	return rows;
};

exports.getAuthorByID = async function (id) {
	const { rows } = await pool.query(
		`
  		SELECT
        author.first_name || ' ' || author.last_name AS name,
        author.biography
      FROM dim_authors AS author
      WHERE author.id = $1;
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

exports.deleteAuthor = async function (author) {
	try {
		await pool.query("BEGIN");

		const { rows: books } = await pool.query("SELECT id FROM fact_books WHERE author_id = $1", [
			author,
		]);

		for (const book of books) {
			await pool.query("DELETE FROM book_genres WHERE book_id = $1;", [book.id]);
			await pool.query("DELETE FROM fact_books WHERE id = $1;", [book.id]);
		}

		await pool.query("DELETE FROM dim_authors WHERE id = $1;", [author]);
		await pool.query("COMMIT");
	} catch (err) {
		await pool.query("ROLLBACK");
		throw err;
	}
};
