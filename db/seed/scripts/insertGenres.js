const fs = require("fs").promises;
const path = require("path");
const { strToSlug } = require("../../../js/utils");

async function insertGenres(client) {
	const filePath = path.join(__dirname, "../../data", "genres.json");
	const data = await fs.readFile(filePath, "utf8");
	const genres = JSON.parse(data);

	for (const genre of genres) {
		genre.slug = strToSlug(genre.genreName);
		await client.query("INSERT INTO dim_genres (name, slug, description) VALUES ($1, $2, $3)", [
			genre.genreName,
			genre.slug,
			genre.genreDescription,
		]);
	}
	console.log("Genres inserted successfully");
}

module.exports = insertGenres;
