const db = require("../db/queries/queries");
const { strToSlug } = require("../js/utils");

exports.postNewBook = async function (req, res) {
	const newBook = req.body;
	newBook["authorID"] = strToSlug(newBook.author);

	console.log("Posting new book:\n", newBook);

	await db.insertBook(newBook);
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
