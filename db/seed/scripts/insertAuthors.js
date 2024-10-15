const path = require("path");
const fs = require("fs").promises;
const Author = require("../../../models/Author");

async function insertAuthors(client) {
	const filePath = path.join(__dirname, "../../data", "authors.json");
	const authorsData = await fs.readFile(filePath, "utf8").then(data => JSON.parse(data));

	for (const entry of authorsData) {
		const author = new Author(entry);

		try {
			await author.fetchCountryID();

			await client.query(
				"INSERT INTO dim_authors (country_id, slug, first_name, last_name, birth_year, biography) VALUES ($1, $2, $3, $4, $5, $6)",
				Object.values(author.toDbEntry())
			);
		} catch (err) {
			console.error(`Error inserting author ${author}`, err);
			continue;
		}
	}
	console.log("Authors inserted successfully");
}

module.exports = insertAuthors;
