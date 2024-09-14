const db = require("../db/queries");

function getIndex(req, res) {
	res.render("index", { title: "Home" });
}

async function getAllBooks(req, res) {
	const books = await db.getAllBooks();
	res.render("allBooks", { title: "Books", books });
}

async function getBook(req, res) {
	const bookId = req.params.book;
	const book = (await db.getBook(bookId))[0];
	res.render("book", { title: book.book_title, book });
}

async function getBooksByAuthor(req, res) {
	const authorSlug = req.params.author;
	const { author } = (await db.getAuthorBySlug(authorSlug))[0];
	const books = await db.getBooksByAuthor(author);
	res.render("author", { title: "Authors", author, books });
}

async function getBooksByGenre(req, res) {
	const genreSlug = req.params.genre;
	const genre = genreSlug
		.split("-")
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
	const books = await db.getBooksByGenre(genre);
	res.render("genre", { title: "Genres", genre, books });
}

async function getAllAuthors(req, res) {
	const authors = await db.getAllAuthors();
	res.render("allAuthors", { title: "Authors", authors });
}

async function getAllGenres(req, res) {
	const genres = await db.getAllGenres();
	genres.forEach(genre => (genre.slug = genre.genre.toLowerCase().replaceAll(" ", "-")));
	res.render("allGenres", { title: "Genres", genres });
}

module.exports = {
	getIndex,
	getAllBooks,
	getBook,
	getBooksByAuthor,
	getBooksByGenre,
	getAllAuthors,
	getAllGenres,
};
