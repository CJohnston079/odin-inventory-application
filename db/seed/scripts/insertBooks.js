const path = require("path");
const fs = require("fs").promises;
const Book = require("../../../models/Book");

async function insertBooks(client) {
	const filePath = path.join(__dirname, "../../data", "books.json");
	const booksData = await fs.readFile(filePath, "utf8").then(data => JSON.parse(data));

	let successCount = 0;
	let failedCount = 0;

	for (const entry of booksData) {
		const book = new Book(entry);

		try {
			await book.fetchAuthorID();

			await client.query(
				"INSERT INTO fact_books (author_id, slug, title, publication_year, is_fiction, description) VALUES ($1, $2, $3, $4, $5, $6)",
				Object.values(book.toDbEntry())
			);

			successCount += 1;
		} catch (err) {
			console.error(`Error inserting book ${book}.`, err);
			failedCount += 1;
			continue;
		}
	}
	console.log(`${successCount} books inserted successfully, ${failedCount} failures`);
}

module.exports = insertBooks;
