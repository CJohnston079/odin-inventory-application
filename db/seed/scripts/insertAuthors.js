const fs = require("fs").promises;
const path = require("path");
const { strToSlug } = require("../../../js/utils");

async function insertAuthors(client) {
	const filePath = path.join(__dirname, "../../data", "authors.json");
	const data = await fs.readFile(filePath, "utf8");
	const authors = JSON.parse(data);

	for (const author of authors) {
		author.id = strToSlug(`${author.firstName} ${author.lastName}`);

		await client.query(
			"INSERT INTO dim_authors (author_id, first_name, last_name, birth_year, nationality, biography) VALUES ($1, $2, $3, $4, $5, $6)",
			[
				author.id,
				author.firstName,
				author.lastName,
				author.birthYear,
				author.nationality,
				author.biography,
			]
		);
	}
	console.log("Authors inserted successfully");
}

module.exports = insertAuthors;
