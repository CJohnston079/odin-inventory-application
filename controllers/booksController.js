const db = require("../db/queries/index");
const Book = require("../models/Book");
const { strToSlug } = require("../js/utils");
const { strToTitleCase } = require("../js/utils");

exports.postNewBook = async function (req, res) {
	const newBook = new Book(req.body);
	console.log("Posting new book:\n", newBook);

	try {
		await db.books.insertBook(newBook);
		res.redirect("/books");
	} catch (err) {
		console.error(`An error occurred posting ${title}:`, err);
		res.status(500).send(`An error occurred posting ${title}: ${err}`);
	}
};

exports.checkBookTitle = async function (req, res) {
	const title = strToTitleCase(req.query.title);
	const author = strToTitleCase(req.query.author);

	if (!title || !author) {
		return res.status(400).json({ error: "Title and author parameters are required" });
	}

	try {
		const authorID = strToSlug(author);
		const exists = await db.books.checkBookTitle(title, authorID);
		res.json({ exists, title, author });
	} catch (err) {
		console.error(`Error checking title ${title} by author ${author}:`, err);
		res.status(500).json({ error: "Server error" });
	}
};

exports.getAllBooks = async function (req, res) {
	const books = await db.books.getAllBooks();

	await Promise.all(
		books.map(book => db.genres.getGenresByBook(book.id).then(genres => (book.genres = genres)))
	);

	res.render("./books/books", { title: "Books", books });
};

exports.getNewBookForm = async function (req, res) {
	const authors = await db.authors.getAuthorNames();
	const genres = await db.genres.getGenreNames();
	res.render("./books/newBook", { title: "New Book", authors, genres });
};

exports.getBook = async function (req, res) {
	const bookId = req.params.book;
	const book = (await db.books.getBook(bookId))[0];
	const moreBooksByAuthor = await db.books.getRandomBooksByAuthor(book.author_id, 4);

	book.genres = await db.genres.getGenresByBook(book.id);

	res.render("./books/book", { title: book.book_title, book, moreBooksByAuthor });
};

exports.updateBook = async function (req, res) {
	const bookID = req.params.book;
	const updatedBook = new Book(req.body);
	console.log("Updating book:\n", updatedBook);

	try {
		await db.books.updateBook(bookID, updatedBook);
		res.redirect(`/books/${bookID}/${updatedBook.slug}`);
	} catch (err) {
		console.error(`An error occurred updating ${updatedBook.title}:`, err);
		res.status(500).send(`An error occurred updating updating ${updatedBook.title}: ${err}`);
	}
};

exports.deleteBook = async function (req, res) {
	const bookID = req.params.book;

	try {
		await db.books.deleteBook(bookID);
		res.redirect("/books");
	} catch (err) {
		console.error(`An error occurred deleting book ${bookID}\n`, err);
		res.status(500).send(`An error occurred deleting book ${bookID}\n ${err}`);
	}
};
