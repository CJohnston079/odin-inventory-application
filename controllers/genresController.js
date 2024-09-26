const db = require("../db/queries/queries");

exports.postNewGenre = async function (req, res) {
	await db.insertGenre(req.body);
	res.redirect("/genres");
};

exports.getAllGenres = async function (req, res) {
	const genres = await db.getAllGenres();
	genres.forEach(genre => (genre.slug = genre.genre.toLowerCase().replaceAll(" ", "-")));
	res.render("allGenres", { title: "Genres", genres });
};

exports.getNewGenreForm = function (req, res) {
	res.render("newGenreForm", { title: "New Genre" });
};

exports.getBooksByGenre = async function (req, res) {
	const genreSlug = req.params.genre;
	const genre = genreSlug
		.split("-")
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
	const books = await db.getBooksByGenre(genre);
	res.render("genre", { title: "Genres", genre, books });
};
