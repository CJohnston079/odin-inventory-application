const fs = require("fs").promises;
const path = require("path");

async function insertBookLanguages(client) {
	const filePath = path.join(__dirname, "../../data", "books.json");
	const data = await fs.readFile(filePath, "utf8");
	const books = JSON.parse(data);

	for (const book of books) {
		const languages = book.languages;
		const bookTitle = book.bookTitle;
		const bookIdQuery = await client.query("SELECT book_id FROM fact_books WHERE book_title = $1", [
			bookTitle,
		]);

		if (bookIdQuery.rows.length === 0) {
			console.log(`Book ID not found for title: ${bookTitle}`);
			continue;
		}

		const bookId = bookIdQuery.rows[0].book_id;

		for (const language of languages) {
			const languageIdQuery = await client.query(
				"SELECT language_id FROM dim_languages WHERE language_name = $1",
				[language]
			);

			if (languageIdQuery.rows.length === 0) {
				console.log(`Language ID not found for language: ${language}`);
				continue;
			}

			const languageId = languageIdQuery.rows[0].language_id;

			await client.query("INSERT INTO book_languages (book_id, language_id) VALUES ($1, $2)", [
				Number(bookId),
				Number(languageId),
			]);
		}
	}
	console.log("Book languages inserted successfully");
}

module.exports = insertBookLanguages;
