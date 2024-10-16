const pool = require("../pool");

exports.getAllCountries = async function () {
	const { rows } = await pool.query(`
		SELECT
      country.id,
      country.slug,
      country.name,
      COUNT(book.id) AS books
    FROM dim_countries AS country
    JOIN dim_authors AS author ON country.id = author.country_id
    JOIN fact_books AS book ON author.id = book.author_id
    GROUP BY country.id
    ORDER BY country.name;
	`);
	return rows;
};

exports.getNationalityNames = async function () {
	const { rows } = await pool.query(`SELECT id, nationality FROM dim_countries;`);
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

exports.getCountryByID = async function (countryID) {
	const { rows } = await pool.query(
		`
    SELECT name FROM dim_countries WHERE id = $1;
  `,
		[countryID]
	);
	return rows[0].name;
};

exports.getCountryIDByNationality = async function (nationality) {
	const { rows } = await pool.query(
		`
      SELECT id FROM dim_countries WHERE nationality = $1;
    `,
		[nationality]
	);
	return rows[0].id;
};
