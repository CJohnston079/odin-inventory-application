const fs = require("fs").promises;
const path = require("path");

async function insertGenres(client) {
	const filePath = path.join(__dirname, "../../data", "genres.json");
	const data = await fs.readFile(filePath, "utf8");
	const genres = JSON.parse(data);

	for (const genre of genres) {
		await client.query("INSERT INTO dim_genres (genre_name, description) VALUES ($1, $2)", [
			genre.genreName,
			genre.genreDescription,
		]);
	}
	console.log("Genres inserted successfully");
}

module.exports = insertGenres;
