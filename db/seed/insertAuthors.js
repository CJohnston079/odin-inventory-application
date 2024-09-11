const fs = require("fs").promises;
const path = require("path");

async function insertAuthors(client) {
	const filePath = path.join(__dirname, "../data", "authors.json");
	const data = await fs.readFile(filePath, "utf8");
	const authors = JSON.parse(data);

	for (const author of authors) {
		await client.query(
			"INSERT INTO dim_authors (first_name, last_name, date_of_birth, nationality, slug) VALUES ($1, $2, $3, $4, $5)",
			[author.firstName, author.lastName, author.dateOfBirth, author.nationality, author.slug]
		);
	}
	console.log("Authors inserted successfully");
}

module.exports = insertAuthors;
