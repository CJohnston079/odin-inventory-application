const db = require("../db/queries/queries");
const { strToSlug } = require("../js/utils");
const { strToTitleCase } = require("../js/utils");
const { capitaliseArray } = require("../js/utils");

exports.postNewBook = async function (req, res) {
	const newBook = req.body;

	newBook["title"] = strToTitleCase(newBook["title"]);
	newBook["authorID"] = strToSlug(newBook.author);
	newBook["genres"] = capitaliseArray(newBook["genres"].replace(/,\s*$/, "").split(","));

	console.log("Posting new book:\n", newBook);

	await db.insertBook(newBook);
	res.redirect("/books");
};

exports.getAllBooks = async function (req, res) {
	const books = await db.getAllBooks();
	res.render("./books/books", { title: "Books", books });
};

exports.getNewBookForm = async function (req, res) {
	const authors = await db.getAuthorNames();
	const genres = await db.getGenreNames();
	res.render("./books/newBook", { title: "New Book", authors, genres });
};

exports.getBook = async function (req, res) {
	const bookId = req.params.book;
	const book = (await db.getBook(bookId))[0];
	res.render("./books/book", { title: book.book_title, book });
};
