const path = require("path");
const fs = require("fs").promises;
const Author = require("../../../models/Author");
const db = require("../../queries/index");
const logger = require("../../../js/logger");

async function insertAuthors() {
	const filePath = path.join(__dirname, "../../data", "authors.json");
	const authorsData = await fs.readFile(filePath, "utf8").then(data => JSON.parse(data));

	const authorsFailed = [];
	let authorsAddedCount = 0;

	for (const entry of authorsData) {
		const author = new Author(entry);

		try {
			await db.authors.insertAuthor(author);
			authorsAddedCount += 1;
		} catch (err) {
			authorsFailed.push(`${author.firstName} ${author.lastName}`);
			continue;
		}
	}
	console.log(
		`> ${authorsAddedCount} authors inserted successfully (${authorsFailed.length} failures)`
	);

	return { authorsAddedCount, authorsFailed };
}

module.exports = insertAuthors;
