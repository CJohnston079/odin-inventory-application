const { strToSlug } = require("../js/utils");
const { strToTitleCase } = require("../js/utils");
const { capitaliseArray } = require("../js/utils");

class Book {
	constructor({ title, description, author, genres, publicationYear }) {
		this.title = strToTitleCase(title);
		this.authorID = strToSlug(author);
		this.genres = capitaliseArray(genres.replace(/,\s*$/, "").split(","));
		this.publicationYear = publicationYear || null;
		this.description = description || null;
	}
}

module.exports = Book;
