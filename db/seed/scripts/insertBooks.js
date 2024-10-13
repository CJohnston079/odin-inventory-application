const fs = require("fs").promises;
const path = require("path");
const { strToSlug } = require("../../../js/utils");

async function insertBooks(client) {
	const filePath = path.join(__dirname, "../../data", "books.json");
	const data = await fs.readFile(filePath, "utf8");
	const books = JSON.parse(data);

	for (const book of books) {
		const author = book.author;
		const authorIdQuery = await client.query(
			"SELECT id FROM dim_authors WHERE (first_name || ' ' || last_name) = $1",
			[author]
		);

		if (authorIdQuery.rows.length === 0) {
			console.log(`Author not found for surname: ${author}`);
			continue;
		}

		book.authorId = authorIdQuery.rows[0].id;
		book.slug = strToSlug(book.bookTitle);

		await client.query(
			"INSERT INTO fact_books (title, slug, author_id, publication_year, is_fiction, description) VALUES ($1, $2, $3, $4, $5, $6)",
			[
				book.bookTitle,
				book.slug,
				book.authorId,
				book.publicationYear,
				book.isFiction,
				book.description,
			]
		);
	}
	console.log("Books inserted successfully");
}

module.exports = insertBooks;
