const db = require("../db/queries/index");
const nationalities = require("../db/data/nationalities");

exports.postNewAuthor = async function (req, res) {
	await db.authors.insertAuthor(req.body);
	res.redirect("/authors");
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
