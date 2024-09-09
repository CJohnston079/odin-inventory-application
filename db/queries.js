const pool = require("./pool");

async function getAllBooks() {
	const { rows } = await pool.query(`
		SELECT fb.*, da.first_name || ' ' || da.last_name AS author
    FROM fact_books fb
    JOIN dim_authors da ON fb.author_id = da.author_id;
	`);
	return rows;
}

module.exports = {
	getAllBooks,
};
