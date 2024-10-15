const db = require("../db/queries/index");
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

	async fetchCountryID() {
		try {
			this.countryID = await db.countries.getCountryIDByNationality(this.nationality);
		} catch (err) {
			console.log(`Error fetching country_id for nationality ${this.nationality}.`, err);
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
