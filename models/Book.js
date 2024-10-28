const db = require("../db/queries/index");
const logger = require("../js/logger");
const { strToSlug } = require("../js/utils");
const { strToTitleCase } = require("../js/utils");
const { capitaliseArray } = require("../js/utils");

class Book {
	constructor({ title, description, author, genres, publicationYear, isFiction }) {
		this.slug = strToSlug(title);
		this.title = strToTitleCase(title);
		this.author = author;
		this.authorSlug = strToSlug(author);
		this.genres = Array.isArray(genres)
			? capitaliseArray(genres)
			: capitaliseArray(genres.replace(/,\s*$/, "").split(","));
		this.isFiction = isFiction;
		this.publicationYear = publicationYear || null;
		this.description = description.slice(0, 280) || "";
		this.authorID = null;
	}

	async fetchAuthorID() {
		try {
			this.authorID = await db.authors.getAuthorIDByName(this.author);
		} catch (err) {
			logger.error(`Error fetching ID for author ${this.author}.`, err);
			throw err;
		}
	}

	toDbEntry() {
		return {
			author_id: this.authorID,
			slug: this.slug,
			title: this.title,
			publication_year: this.publicationYear,
			is_fiction: this.isFiction,
			description: this.description,
		};
	}
}

module.exports = Book;
