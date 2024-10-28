const db = require("../db/queries/index");
const logger = require("../js/logger");
const { strToSlug } = require("../js/utils");
const { strToTitleCase } = require("../js/utils");
const { strToNameCase } = require("../js/utils");

class Author {
	constructor({ firstName, lastName, birthYear, nationality, biography }) {
		this.slug = strToSlug(`${firstName} ${lastName}`);
		this.firstName = strToNameCase(firstName);
		this.lastName = strToNameCase(lastName, { isSurname: true });
		this.nationality = strToTitleCase(nationality);
		this.birthYear = birthYear || null;
		this.biography = biography || "";
	}

	async fetchCountryID() {
		try {
			this.countryID = await db.countries.getCountryIDByNationality(this.nationality);
		} catch (err) {
			logger.error(
				`Error fetching country_id with nationality "${this.nationality} for author ${this.firstName} + ${this.lastName}".`,
				err
			);
			throw err;
		}
	}

	toDbEntry() {
		return {
			country_id: this.countryID,
			slug: this.slug,
			first_name: this.firstName,
			last_name: this.lastName,
			birth_year: this.birthYear,
			biography: this.biography,
		};
	}
}

module.exports = Author;
