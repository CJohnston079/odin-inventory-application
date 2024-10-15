const path = require("path");
const fs = require("fs").promises;
const Author = require("../../../models/Author");
const db = require("../../queries/index");

async function insertAuthors() {
	const filePath = path.join(__dirname, "../../data", "authors.json");
	const authorsData = await fs.readFile(filePath, "utf8").then(data => JSON.parse(data));

	for (const entry of authorsData) {
		const author = new Author(entry);

		try {
			await db.authors.insertAuthor(author);
		} catch (err) {
			console.error(`Error inserting author ${author}`, err);
			continue;
		}
	}
	console.log("Authors inserted successfully");
}

module.exports = insertAuthors;
