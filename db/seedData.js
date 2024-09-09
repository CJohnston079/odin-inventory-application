const fs = require("fs").promises;
const path = require("path");

async function insertAuthors(client) {
	const filePath = path.join(__dirname, "data", "authors.json");
	const data = await fs.readFile(filePath, "utf8");
	const authors = JSON.parse(data);

	for (const author of authors) {
		await client.query(
			"INSERT INTO dim_authors (first_name, last_name, date_of_birth, nationality) VALUES ($1, $2, $3, $4)",
			[author.firstName, author.lastName, author.dateOfBirth, author.nationality]
		);
	}
	console.log("Authors inserted successfully");
}

async function insertGenres(client) {
	const filePath = path.join(__dirname, "data", "genres.json");
	const data = await fs.readFile(filePath, "utf8");
	const genres = JSON.parse(data);

	for (const genre of genres) {
		await client.query("INSERT INTO dim_genres (genre_name, description) VALUES ($1, $2)", [
			genre.genreName,
			genre.genreDescription,
		]);
	}
	console.log("Genres inserted successfully");
}

async function insertLanguages(client) {
	const filePath = path.join(__dirname, "data", "languages.json");
	const data = await fs.readFile(filePath, "utf8");
	const languages = JSON.parse(data);

	for (const language of languages) {
		await client.query("INSERT INTO dim_languages (language_name) VALUES ($1)", [
			language.language,
		]);
	}
	console.log("Languages inserted successfully");
}

async function insertBooks(client) {
	const filePath = path.join(__dirname, "data", "books.json");
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

async function insertBookGenres(client) {
	const filePath = path.join(__dirname, "data", "books.json");
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

module.exports = {
	insertAuthors,
	insertGenres,
	insertLanguages,
	insertBooks,
	insertBookGenres,
};
