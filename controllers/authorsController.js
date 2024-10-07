const db = require("../db/queries/index");
const nationalities = require("../db/data/countries");

exports.postNewAuthor = async function (req, res) {
	try {
		await db.authors.insertAuthor(req.body);
		res.redirect("/authors");
	} catch (err) {
		console.error(`An error occurred posting new author:`, err);
		res.status(500).send(`An error occurred posting new author: ${err}`);
	}
};

exports.getAllAuthors = async function (req, res) {
	const authors = await db.authors.getAllAuthors();
	res.render("./authors/authors", { title: "Authors", authors });
};

exports.getNewAuthorForm = function (req, res) {
	res.render("./authors/newAuthor", { title: "New Author", nationalities });
};

exports.getBooksByAuthor = async function (req, res) {
	const authorID = req.params.author;
	const { author } = (await db.authors.getAuthorByID(authorID))[0];
	const books = await db.books.getBooksByAuthor(author);
	res.render("./authors/author", { title: "Authors", author, books });
};

exports.getAuthorNames = async function (req, res) {
	const authors = await db.authors.getAuthorNames();
	res.json({ authors });
};