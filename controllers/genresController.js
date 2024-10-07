const db = require("../db/queries/index");
const { strToSlug, slugToStr } = require("../js/utils");
const { capitaliseStr } = require("../js/utils");

exports.postNewGenre = async function (req, res) {
	try {
		await db.genres.insertGenre(req.body);
		res.redirect("/genres");
	} catch (err) {
		console.error(`An error occurred posting new genre:`, err);
		res.status(500).send(`An error occurred posting new genre: ${err}`);
	}
};

exports.getAllGenres = async function (req, res) {
	const genres = await db.genres.getAllGenres();
	genres.forEach(genre => (genre.slug = strToSlug(genre.genre)));
	res.render("./genres/genres", { title: "Genres", genres });
};

exports.getNewGenreForm = function (req, res) {
	res.render("./genres/newGenre", { title: "New Genre" });
};

exports.getBooksByGenre = async function (req, res) {
	const genreSlug = req.params.genre;
	const genre = slugToStr(genreSlug);
	const books = await db.books.getBooksByGenre(genre);
	res.render("./genres/genre", { title: "Genres", genre, books });
};

exports.getGenreNames = async function (req, res) {
	const genres = await db.genres.getGenreNames();
	res.json({ genres });
};
