const path = require("path");
const fs = require("fs").promises;
const Genre = require("../../../models/Genre");

async function insertGenres(client) {
	const filePath = path.join(__dirname, "../../data", "genres.json");
	const genresData = await fs.readFile(filePath, "utf8").then(data => JSON.parse(data));

	for (const entry of genresData) {
		const genre = new Genre(entry);
		try {
			await client.query(
				"INSERT INTO dim_genres (slug, name, description) VALUES ($1, $2, $3)",
				Object.values(genre.toDbEntry())
			);
		} catch (err) {
			console.error(`Error inserting genre ${genre}`, err);
			continue;
		}
	}
	console.log("Genres inserted successfully");
}

module.exports = insertGenres;
