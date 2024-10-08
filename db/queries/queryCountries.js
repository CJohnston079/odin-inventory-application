const pool = require("../pool");

exports.getAllCountries = async function () {
	const { rows } = await pool.query(`
		SELECT
      c.country_name AS country,
      COUNT(b.book_id) AS books
    FROM dim_countries c
    JOIN dim_authors a ON c.nationality = a.nationality
    JOIN fact_books b ON a.author_id = b.author_id
    GROUP BY country
    ORDER BY country
	`);
	return rows;
};
