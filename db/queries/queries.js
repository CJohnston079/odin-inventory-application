const books = require("./queryBooks");
const authors = require("./queryAuthors");
const genres = require("./queryGenres");

module.exports = {
	getAllBooks: books.getAllBooks,
	getBook: books.getBook,
	getBooksByAuthor: books.getBooksByAuthor,
	getBooksByGenre: books.getBooksByGenre,
	insertBook: books.insertBook,
	getAllDecades: books.getAllDecades,
	getBooksByDecade: books.getBooksByDecade,
	checkBookTitle: books.checkBookTitle,

	getAuthorNames: authors.getAuthorNames,
	getAllAuthors: authors.getAllAuthors,
	getAuthorByID: authors.getAuthorByID,
	insertAuthor: authors.insertAuthor,

	getGenreNames: genres.getGenreNames,
	getAllGenres: genres.getAllGenres,
	insertGenre: genres.insertGenre,
};
