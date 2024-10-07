const db = require("../db/queries/index");
const Book = require("../models/Book");
const { strToSlug } = require("../js/utils");
const { strToTitleCase } = require("../js/utils");

exports.postNewBook = async function (req, res) {
	const { title, description, author, genres, publicationYear } = req.body;
	const newBook = new Book({ title, description, author, genres, publicationYear });

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

exports.checkAuthor = async function (req, res) {
	const author = strToTitleCase(req.query.author);

	if (!author) {
		return;
	}

	try {
		const authorID = strToSlug(author);
		const exists = await db.authors.checkAuthor(authorID);
		res.json({ exists, author });
	} catch (err) {
		console.error(`Error checking author ${author}`);
		res.status(500).json({ error: "Server error" });
	}
};

exports.checkGenre = async function (req, res) {
	const genre = strToTitleCase(req.query.genre);

	if (!genre) {
		return;
	}

	try {
		const exists = await db.genres.checkGenre(genre);
		res.json({ exists, genre });
	} catch (err) {
		console.error(`Error checking genre ${genre}`, err);
		res.status(500).json({ error: "Server error" });
	}
};

exports.getAllBooks = async function (req, res) {
	const books = await db.books.getAllBooks();
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
	res.render("./books/book", { title: book.book_title, book });
};
