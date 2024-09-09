const fs = require("fs").promises;
const path = require("path");

async function insertBooks(client) {
	const filePath = path.join(__dirname, "../data", "books.json");
	const data = await fs.readFile(filePath, "utf8");
	const books = JSON.parse(data);

	for (const book of books) {
		const author = book.author;
		const authorIdQuery = await client.query(
			"SELECT author_id FROM dim_authors WHERE (first_name || ' ' || last_name) = $1",
			[author]
		);

		if (authorIdQuery.rows.length === 0) {
			console.log(`Author not found for surname: ${author}`);
			continue;
		}

		const authorId = authorIdQuery.rows[0].author_id;

		await client.query(
			"INSERT INTO fact_books (book_title, author_id, publication_year, category) VALUES ($1, $2, $3, $4)",
			[book.bookTitle, authorId, book.publicationYear, book.category]
		);
	}
	console.log("Books inserted successfully");
}

module.exports = insertBooks;
