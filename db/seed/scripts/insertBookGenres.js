const fs = require("fs").promises;
const path = require("path");

async function insertBookGenres(client) {
	const filePath = path.join(__dirname, "../../data", "books.json");
	const data = await fs.readFile(filePath, "utf8");
	const books = JSON.parse(data);

	for (const book of books) {
		const genres = book.genres;
		const bookTitle = book.title;
		const bookIdQuery = await client.query("SELECT id FROM fact_books WHERE title = $1", [
			bookTitle,
		]);

		if (bookIdQuery.rows.length === 0) {
			console.log(`Book ID not found for ${bookTitle}`);
			continue;
		}

		const bookId = bookIdQuery.rows[0].id;

		for (const genre of genres) {
			const genreIdQuery = await client.query("SELECT id FROM dim_genres WHERE name = $1", [genre]);

			if (genreIdQuery.rows.length === 0) {
				console.log(`Genre ID not found for ${genre}`);
				continue;
			}

			const genreId = genreIdQuery.rows[0].id;

			await client.query("INSERT INTO book_genres (book_id, genre_id) VALUES ($1, $2)", [
				Number(bookId),
				Number(genreId),
			]);
		}
	}
	console.log("Book genres inserted successfully");
}

module.exports = insertBookGenres;
