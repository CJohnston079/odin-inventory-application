const path = require("path");
const fs = require("fs").promises;
const Genre = require("../../../models/Genre");
const db = require("../../queries/index");
const logger = require("../../../js/logger");

async function insertGenres() {
	const filePath = path.join(__dirname, "../../data", "genres.json");
	const genresData = await fs.readFile(filePath, "utf8").then(data => JSON.parse(data));

	const genresFailed = [];
	let genresAddedCount = 0;

	for (const entry of genresData) {
		const genre = new Genre(entry);
		try {
			await db.genres.insertGenre(genre);
			genresAddedCount += 1;
		} catch (err) {
			genresFailed.push(genre.name);
			continue;
		}
	}
	console.log(
		`> ${genresAddedCount} genres inserted successfully (${genresFailed.length} failures)`
	);

	return { genresAddedCount, genresFailed };
}

module.exports = insertGenres;
