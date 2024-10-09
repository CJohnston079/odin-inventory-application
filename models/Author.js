const { strToSlug } = require("../js/utils");
const { strToTitleCase } = require("../js/utils");

class Author {
	constructor({ firstName, lastName, birthYear, nationality, biography }) {
		this.firstName = strToTitleCase(firstName);
		this.lastName = strToTitleCase(lastName);
		this.authorID = strToSlug(`${this.firstName} ${this.lastName}`);
		this.nationality = strToTitleCase(nationality);
		this.birthYear = birthYear || null;
		this.biography = biography || null;
	}
}

module.exports = Author;
