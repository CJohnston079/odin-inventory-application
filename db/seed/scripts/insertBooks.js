const path = require("path");
const fs = require("fs").promises;
const Book = require("../../../models/Book");
const db = require("../../queries/index");

async function insertBooks() {
	const filePath = path.join(__dirname, "../../data", "books.json");
	const booksData = await fs.readFile(filePath, "utf8").then(data => JSON.parse(data));

	const booksFailed = [];
	let booksAddedCount = 0;

	for (const entry of booksData) {
		const book = new Book(entry);

		try {
			await db.books.insertBook(book);
			booksAddedCount += 1;
		} catch (err) {
			booksFailed.push(book.title);
			continue;
		}
	}
	console.log(`> ${booksAddedCount} books inserted successfully (${booksFailed.length} failures)`);

	return { booksAddedCount, booksFailed };
}

module.exports = insertBooks;
