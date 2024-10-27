const db = require("../db/queries/index");

exports.getIndex = async function (req, res) {
	const featuredBooks = await db.books.getRandomBooks();
	const featuredAuthors = await db.authors.getRandomAuthors();
	const featuredGenres = await db.genres.getRandomGenres();
	const featuredDecades = await db.books.getRandomDecades();

	await Promise.all(
		featuredGenres.map(genre =>
			db.books.getRandomBooksByGenre(genre.id).then(books => (genre.books = books))
		)
	);

	await Promise.all(
		featuredDecades.map(decade =>
			db.books.getRandomBooksByDecade(decade.decade).then(books => (decade.books = books))
		)
	);

	res.render("index", {
		title: "Home",
		featuredBooks,
		featuredAuthors,
		featuredGenres,
		featuredDecades,
	});
};

exports.getPageNotFound = function (req, res) {
	res.render("page-not-found");
};
