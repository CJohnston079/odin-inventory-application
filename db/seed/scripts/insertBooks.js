const path = require("path");
const fs = require("fs").promises;
const Book = require("../../../models/Book");
const db = require("../../queries/index");

async function insertBooks() {
	const filePath = path.join(__dirname, "../../data", "books.json");
	const booksData = await fs.readFile(filePath, "utf8").then(data => JSON.parse(data));

	let successCount = 0;
	let failedCount = 0;

	for (const entry of booksData) {
		const book = new Book(entry);

		try {
			await db.books.insertBook(book);
			successCount += 1;
		} catch (err) {
			console.error(`Error inserting book ${book}.`, err);
			failedCount += 1;
			continue;
		}
	}
	console.log(`> ${successCount} books inserted successfully (${failedCount} failures)`);
}

module.exports = insertBooks;
