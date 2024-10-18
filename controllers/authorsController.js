const db = require("../db/queries/index");
const nationalities = require("../db/data/countries");
const Author = require("../models/Author");
const { strToTitleCase } = require("../js/utils");
const { strToSlug } = require("../js/utils");

exports.postNewAuthor = async function (req, res) {
	const newAuthor = new Author(req.body);
	console.log("Posting new author:\n", newAuthor);

	try {
		await db.authors.insertAuthor(newAuthor);
		res.redirect("/authors");
	} catch (err) {
		console.error(`An error occurred posting new author:`, err);
		res.status(500).send(`An error occurred posting new author: ${err}`);
	}
};

exports.getAllAuthors = async function (req, res) {
	const authors = await db.authors.getAllAuthors();

	await Promise.all(
		authors.map(author =>
			db.genres.getGenresByAuthor(author.id).then(genres => (author.genres = genres))
		)
	);

	res.render("./authors/authors", { title: "Authors", authors });
};

exports.getNewAuthorForm = function (req, res) {
	res.render("./authors/newAuthor", { title: "New Author", nationalities });
};

exports.getBooksByAuthor = async function (req, res) {
	const authorID = req.params.author;
	const author = (await db.authors.getAuthorByID(authorID))[0];
	const books = await db.books.getBooksByAuthor(author.name);

	await Promise.all(
		books.map(book => db.genres.getGenresByBook(book.id).then(genres => (book.genres = genres)))
	);

	res.render("./authors/author", { title: "Authors", author, books });
};

exports.getAuthorNames = async function (req, res) {
	const authors = await db.authors.getAuthorNames();
	res.json({ authors });
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
		console.error(`Error checking author ${author}.`, err);
		res.status(500).json({ error: "Server error" });
	}
};
