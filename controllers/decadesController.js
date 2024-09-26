const db = require("../db/queries/queries");

exports.getAllDecades = async function (req, res) {
	const data = await db.getAllDecades();
	const centuries = {};

	data.forEach(entry => {
		const decade = Number(entry.decade.replace("s", ""), 10);
		const century = Math.floor(decade / 100) * 100;

		if (!centuries[century]) {
			centuries[century] = [];
		}

		centuries[century].push(entry);
	});
	res.render("allDecades", { title: "Decades", centuries });
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
