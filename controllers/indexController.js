const db = require("../db/queries");

exports.getIndex = function (req, res) {
	res.render("index", { title: "Home" });
};

exports.getAllBooks = async function (req, res) {
	const books = await db.getAllBooks();
	res.render("allBooks", { title: "Books", books });
};

exports.getNewBookForm = async function (req, res) {
	const authors = await db.getAuthorNames();
	const genres = await db.getGenreNames();
	res.render("newBookForm", { title: "New Book", authors, genres });
};

exports.getBook = async function (req, res) {
	const bookId = req.params.book;
	const book = (await db.getBook(bookId))[0];
	res.render("book", { title: book.book_title, book });
};

exports.getBooksByAuthor = async function (req, res) {
	const authorID = req.params.author;
	const { author } = (await db.getAuthorByID(authorID))[0];
	const books = await db.getBooksByAuthor(author);
	res.render("author", { title: "Authors", author, books });
};

exports.getBooksByGenre = async function (req, res) {
	const genreSlug = req.params.genre;
	const genre = genreSlug
		.split("-")
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
	const books = await db.getBooksByGenre(genre);
	res.render("genre", { title: "Genres", genre, books });
};

exports.getAllAuthors = async function (req, res) {
	const authors = await db.getAllAuthors();
	res.render("allAuthors", { title: "Authors", authors });
};

exports.getAllGenres = async function (req, res) {
	const genres = await db.getAllGenres();
	genres.forEach(genre => (genre.slug = genre.genre.toLowerCase().replaceAll(" ", "-")));
	res.render("allGenres", { title: "Genres", genres });
};
