const pool = require("../pool");
const { strToSlug } = require("../../js/utils");

exports.insertAuthor = async function (newAuthor) {
	const { firstName, lastName, birthYear, nationality } = newAuthor;
	const authorID = strToSlug(`${firstName} ${lastName}`);

	const query = `
    INSERT INTO dim_authors (author_id, first_name, last_name, birth_year, nationality)
    VALUES ($1, $2, $3, $4, $5)
  `;

	try {
		await pool.query(query, [authorID, firstName, lastName, birthYear, nationality]);
	} catch (error) {
		console.error(`Error inserting author ${firstName} ${lastName}:`, error);
		throw error;
	}
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

exports.getAllAuthors = async function () {
	const { rows } = await pool.query(`
    WITH GenreCounts AS (
      SELECT
        fb.author_id,
        dg.genre_name,
        COUNT(DISTINCT fb.book_id) AS genre_count
      FROM fact_books fb
      JOIN book_genres bg ON fb.book_id = bg.book_id
      JOIN dim_genres dg ON bg.genre_id = dg.genre_id
      GROUP BY fb.author_id, dg.genre_name
    )
    SELECT
      da.author_id,
      da.first_name || ' ' || da.last_name AS author_name,
      da.birth_year,
      da.nationality,
      COALESCE((
        SELECT STRING_AGG(gc.genre_name, ',' ORDER BY gc.genre_count DESC, gc.genre_name)
        FROM GenreCounts gc
        WHERE gc.author_id = da.author_id
      ), '') AS genres,
      COUNT(DISTINCT fb.book_id) AS number_of_books
    FROM dim_authors da
    LEFT JOIN fact_books fb ON da.author_id = fb.author_id
    GROUP BY da.author_id, da.first_name, da.last_name, da.birth_year, da.nationality
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
