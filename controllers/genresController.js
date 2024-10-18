const db = require("../db/queries/index");
const Genre = require("../models/Genre");
const { strToSlug } = require("../js/utils");
const { slugToStr } = require("../js/utils");
const { strToTitleCase } = require("../js/utils");

exports.postNewGenre = async function (req, res) {
	const newGenre = new Genre(req.body);
	console.log("Posting new genre:\n", newGenre);

	try {
		await db.genres.insertGenre(newGenre);
		res.redirect("/genres");
	} catch (err) {
		console.error(`An error occurred posting new genre:`, err);
		res.status(500).send(`An error occurred posting new genre: ${err}`);
	}
};

exports.getAllGenres = async function (req, res) {
	const genres = await db.genres.getAllGenres();
	genres.forEach(genre => (genre.slug = strToSlug(genre.name)));
	res.render("./genres/genres", { title: "Genres", genres });
};

exports.getNewGenreForm = function (req, res) {
	res.render("./genres/newGenre", { title: "New Genre" });
};

exports.getBooksByGenre = async function (req, res) {
	const genreID = req.params.genre;
	const genre = (await db.genres.getGenreByID(genreID))[0];
	const books = await db.books.getBooksByGenre(genreID);

	await Promise.all(
		books.map(book => db.genres.getGenresByBook(book.id).then(genres => (book.genres = genres)))
	);

	res.render("./genres/genre", { title: "Genres", genre, books });
};

exports.checkGenre = async function (req, res) {
	const genre = strToTitleCase(req.query.genre);

	if (!genre) {
		return;
	}

	try {
		const exists = await db.genres.checkGenre(genre);
		res.json({ exists, genre });
	} catch (err) {
		console.error(`Error checking genre ${genre}`, err);
		res.status(500).json({ error: "Server error" });
	}
};

exports.getGenreNames = async function (req, res) {
	const genres = await db.genres.getGenreNames();
	res.json({ genres });
};
