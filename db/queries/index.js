const pool = require("../pool");
const books = require("./queryBooks");
const authors = require("./queryAuthors");
const genres = require("./queryGenres");
const countries = require("./queryCountries");

const getItemCounts = async function () {
	const { rows } = await pool.query(`
    SELECT 
      (SELECT COUNT(id) FROM fact_books) AS books,
      (SELECT COUNT(id) FROM dim_authors) AS authors,
      (SELECT COUNT(id) FROM dim_genres) AS genres,
      (SELECT COUNT(DISTINCT country_id) FROM dim_authors) AS countries,
      (
        SELECT COUNT(*) 
          FROM (
          SELECT 
            FLOOR(publication_year / 10) * 10 AS decade
          FROM fact_books
          GROUP BY decade
          HAVING COUNT(id) > 0
        ) AS decades_with_books
      ) AS decades;
	`);

	return rows;
};

module.exports = {
	books,
	authors,
	genres,
	countries,
	getItemCounts,
};
