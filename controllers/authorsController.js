const db = require("../db/queries/queries");
const nationalities = require("../db/data/nationalities");

exports.postNewAuthor = async function (req, res) {
	await db.insertAuthor(req.body);
	res.redirect("/authors");
};

exports.getAllAuthors = async function (req, res) {
	const authors = await db.getAllAuthors();
	res.render("allAuthors", { title: "Authors", authors });
};

exports.getNewAuthorForm = function (req, res) {
	res.render("newAuthorForm", { title: "New Author", nationalities });
};

exports.getBooksByAuthor = async function (req, res) {
	const authorID = req.params.author;
	const { author } = (await db.getAuthorByID(authorID))[0];
	const books = await db.getBooksByAuthor(author);
	res.render("author", { title: "Authors", author, books });
};
