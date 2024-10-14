const { strToSlug } = require("../js/utils");
const { strToTitleCase } = require("../js/utils");
const { strToNameCase } = require("../js/utils");

class Author {
	constructor({ firstName, lastName, birthYear, nationality, biography }) {
		this.slug = strToSlug(`${firstName} ${lastName}`);
		this.firstName = strToNameCase(firstName);
		this.lastName = strToNameCase(lastName);
		this.nationality = strToTitleCase(nationality);
		this.birthYear = birthYear || null;
		this.biography = biography || null;
	}
}

module.exports = Author;
