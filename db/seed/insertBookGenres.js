const fs = require("fs").promises;
const path = require("path");

async function insertBookGenres(client) {
	const filePath = path.join(__dirname, "../data", "books.json");
	const data = await fs.readFile(filePath, "utf8");
	const books = JSON.parse(data);

	for (const book of books) {
		const genres = book.genres;
		const bookTitle = book.bookTitle;
		const bookIdQuery = await client.query("SELECT book_id FROM fact_books WHERE book_title = $1", [
			bookTitle,
		]);

		if (bookIdQuery.rows.length === 0) {
			console.log(`Book ID not found for title: ${bookTitle}`);
			continue;
		}

		const bookId = bookIdQuery.rows[0].book_id;

		for (const genre of genres) {
			const genreIdQuery = await client.query(
				"SELECT genre_id FROM dim_genres WHERE genre_name = $1",
				[genre]
			);

			if (genreIdQuery.rows.length === 0) {
				console.log(`Genre ID not found for genre: ${genre}`);
				continue;
			}

			const genreId = genreIdQuery.rows[0].genre_id;

			await client.query("INSERT INTO book_genres (book_id, genre_id) VALUES ($1, $2)", [
				Number(bookId),
				Number(genreId),
			]);
		}
	}
	console.log("Book genres inserted successfully");
}

module.exports = insertBookGenres;
