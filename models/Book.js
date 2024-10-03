const { strToSlug } = require("../js/utils");
const { strToTitleCase } = require("../js/utils");
const { capitaliseArray } = require("../js/utils");

class Book {
	constructor(title, authorID, genres, publicationYear) {
		this.title = strToTitleCase(title);
		this.authorID = strToSlug(authorID);
		this.genres = capitaliseArray(genres.replace(/,\s*$/, "").split(","));
		this.publicationYear = publicationYear || null;
	}
}

module.exports = Book;
