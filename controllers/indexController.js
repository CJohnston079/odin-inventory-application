const db = require("../db/queries/index");

exports.getIndex = async function (req, res) {
	const featuredBooks = await db.books.getRandomBooks();
	const featuredAuthors = await db.authors.getRandomAuthors();

	res.render("index", { title: "Home", featuredBooks, featuredAuthors });
};
