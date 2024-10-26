const db = require("../db/queries/index");

exports.getIndex = async function (req, res) {
	const featuredBooks = await db.books.getRandomBooks();
	const featuredAuthors = await db.authors.getRandomAuthors();
	const featuredGenres = await db.genres.getRandomGenres();

	await Promise.all(
		featuredGenres.map(genre =>
			db.books.getRandomBooksByGenre(genre.id).then(books => (genre.books = books))
		)
	);

	res.render("index", { title: "Home", featuredBooks, featuredAuthors, featuredGenres });
};
