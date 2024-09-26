const db = require("../db/queries/queries");

exports.getAllDecades = async function (req, res) {
	const decades = await db.getAllDecades();
	res.render("allDecades", { title: "Decades", decades });
};

// exports.getBooksByDecade = async function (req, res) {
// 	const genreSlug = req.params.genre;
// 	const genre = genreSlug
// 		.split("-")
// 		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
// 		.join(" ");
// 	const books = await db.getBooksByGenre(genre);
// 	res.render("genre", { title: "Genres", genre, books });
// };
