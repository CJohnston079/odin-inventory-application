const db = require("../db/queries/index");

exports.getIndex = async function (req, res) {
	const featuredBooks = await db.books.getRandomBooks();

	res.render("index", { title: "Home", featuredBooks });
};
