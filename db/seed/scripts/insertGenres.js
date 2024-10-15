const path = require("path");
const fs = require("fs").promises;
const Genre = require("../../../models/Genre");
const db = require("../../queries/index");

async function insertGenres() {
	const filePath = path.join(__dirname, "../../data", "genres.json");
	const genresData = await fs.readFile(filePath, "utf8").then(data => JSON.parse(data));

	for (const entry of genresData) {
		const genre = new Genre(entry);
		try {
			await db.genres.insertGenre(genre);
		} catch (err) {
			console.error(`Error inserting genre ${genre}`, err);
			continue;
		}
	}
	console.log("Genres inserted successfully");
}

module.exports = insertGenres;
