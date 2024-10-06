const fs = require("fs").promises;
const path = require("path");

async function insertCountries(client) {
	const filePath = path.join(__dirname, "../../data", "countries.json");
	const data = await fs.readFile(filePath, "utf8");
	const countries = JSON.parse(data);

	for (const country of countries) {
		await client.query(
			"INSERT INTO dim_countries (country_name, nationality, language_name) VALUES ($1, $2, $3)",
			[country.country, country.nationality, country.language]
		);
	}
	console.log("Countries inserted successfully");
}

module.exports = insertCountries;
