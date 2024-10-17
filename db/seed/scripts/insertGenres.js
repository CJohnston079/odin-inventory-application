const path = require("path");
const fs = require("fs").promises;
const Genre = require("../../../models/Genre");
const db = require("../../queries/index");
const logger = require("../../../js/logger");

async function insertGenres() {
	const filePath = path.join(__dirname, "../../data", "genres.json");
	const genresData = await fs.readFile(filePath, "utf8").then(data => JSON.parse(data));

	let successCount = 0;
	let failedCount = 0;

	for (const entry of genresData) {
		const genre = new Genre(entry);
		try {
			await db.genres.insertGenre(genre);
			successCount += 1;
		} catch (err) {
			failedCount += 1;
			continue;
		}
	}
	console.log(`> ${successCount} genres inserted successfully (${failedCount} failures)`);
}

module.exports = insertGenres;
