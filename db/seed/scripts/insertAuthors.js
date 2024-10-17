const path = require("path");
const fs = require("fs").promises;
const Author = require("../../../models/Author");
const db = require("../../queries/index");
const logger = require("../../../js/logger");

async function insertAuthors() {
	const filePath = path.join(__dirname, "../../data", "authors.json");
	const authorsData = await fs.readFile(filePath, "utf8").then(data => JSON.parse(data));

	let successCount = 0;
	let failedCount = 0;

	for (const entry of authorsData) {
		const author = new Author(entry);

		try {
			await db.authors.insertAuthor(author);
			successCount += 1;
		} catch (err) {
			failedCount += 1;
			continue;
		}
	}
	console.log(`> ${successCount} authors inserted successfully (${failedCount} failures)`);
}

module.exports = insertAuthors;
