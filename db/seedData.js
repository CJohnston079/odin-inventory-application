const fs = require("fs").promises;
const path = require("path");

async function insertAuthors(client) {
	const filePath = path.join(__dirname, "data", "authors.json");
	const data = await fs.readFile(filePath, "utf8");
	const authors = JSON.parse(data);

	for (const author of authors) {
		await client.query(
			"INSERT INTO dim_authors (first_name, last_name, date_of_birth, nationality) VALUES ($1, $2, $3, $4)",
			[author.firstName, author.lastName, author.dateOfBirth, author.nationality]
		);
	}
	console.log("Authors inserted successfully");
}

async function insertGenres(client) {
	const filePath = path.join(__dirname, "data", "genres.json");
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

async function insertLanguages(client) {
	const filePath = path.join(__dirname, "data", "languages.json");
	const data = await fs.readFile(filePath, "utf8");
	const languages = JSON.parse(data);

	for (const language of languages) {
		await client.query("INSERT INTO dim_languages (language_name) VALUES ($1)", [
			language.language,
		]);
	}
	console.log("Languages inserted successfully");
}

module.exports = {
	insertAuthors,
	insertGenres,
	insertLanguages,
};
