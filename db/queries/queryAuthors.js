const pool = require("../pool");
const { strToSlug } = require("../../js/utils");

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
		SELECT
      da.first_name || ' ' || da.last_name AS author_name,
      COUNT(fb.book_id) AS number_of_books,
      da.author_id
    FROM dim_authors da
    LEFT JOIN fact_books fb ON da.author_id = fb.author_id
    GROUP BY da.author_id
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

exports.insertAuthor = async function (newAuthor) {
	newAuthor.id = strToSlug(`${newAuthor["first-name"]} ${newAuthor["last-name"]}`);

	await pool.query(
		"INSERT INTO dim_authors (author_id, first_name, last_name, birth_year, nationality) VALUES ($1, $2, $3, $4, $5)",
		[
			newAuthor.id,
			newAuthor["first-name"],
			newAuthor["last-name"],
			newAuthor["birth-year"],
			newAuthor["nationality"],
		]
	);
};
