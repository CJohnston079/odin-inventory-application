const db = require("../db/queries/queries");

exports.postNewBook = async function (req, res) {
	await db.insertBook(req.body);
	res.redirect("/books");
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
