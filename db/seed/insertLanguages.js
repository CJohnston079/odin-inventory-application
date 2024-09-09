const fs = require("fs").promises;
const path = require("path");

async function insertLanguages(client) {
	const filePath = path.join(__dirname, "../data", "languages.json");
	const data = await fs.readFile(filePath, "utf8");
	const languages = JSON.parse(data);

	for (const language of languages) {
		await client.query("INSERT INTO dim_languages (language_name) VALUES ($1)", [
			language.language,
		]);
	}
	console.log("Languages inserted successfully");
}

module.exports = insertLanguages;
