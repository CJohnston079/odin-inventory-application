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

exports.getNationalityNames = async function () {
	const { rows } = await pool.query(`
    SELECT country_id AS id, nationality FROM dim_countries;
  `);
	return rows;
};

exports.checkNationality = async function (nationality) {
	const query = `
		SELECT 1 FROM dim_countries
		WHERE nationality = $1
		LIMIT 1;
	`;

	const result = await pool.query(query, [nationality]);
	const nationalityExists = result.rowCount > 0;

	return nationalityExists;
};
