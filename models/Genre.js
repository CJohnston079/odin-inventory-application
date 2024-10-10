const { strToTitleCase } = require("../js/utils");

class Genre {
	constructor({ genre, description }) {
		this.name = strToTitleCase(genre);
		this.description = description || null;
	}
}

module.exports = Genre;
