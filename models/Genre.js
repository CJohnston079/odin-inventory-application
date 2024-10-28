const { strToSlug } = require("../js/utils");
const { strToTitleCase } = require("../js/utils");

class Genre {
	constructor({ genre, description }) {
		this.slug = strToSlug(genre);
		this.name = strToTitleCase(genre);
		this.description = description || "";
	}

	toDbEntry() {
		return {
			slug: this.slug,
			name: this.name,
			description: this.description,
		};
	}
}

module.exports = Genre;
