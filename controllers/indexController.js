const db = require("../db/queries");

async function getAllBooks(req, res) {
	const books = await db.getAllBooks();
	res.render("index", { title: "Home", books });
}

module.exports = { getAllBooks };
