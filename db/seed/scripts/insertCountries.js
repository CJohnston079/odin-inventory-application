const fs = require("fs").promises;
const path = require("path");
const { strToSlug } = require("../../../js/utils");

async function insertCountries(client) {
	const filePath = path.join(__dirname, "../../data", "countries.json");
	const data = await fs.readFile(filePath, "utf8");
	const countries = JSON.parse(data);

	let successCount = 0;
	let failedCount = 0;

	for (const country of countries) {
		country.slug = strToSlug(country.country);
		try {
			await client.query(
				"INSERT INTO dim_countries (slug, name, nationality, language) VALUES ($1, $2, $3, $4)",
				[country.slug, country.country, country.nationality, country.language]
			);
			successCount += 1;
		} catch (err) {
			console.error(`Error inserting country ${country}`, err);
			failedCount += 1;
			continue;
		}
	}
	console.log(`${successCount} countries inserted successfully, ${failedCount} failures`);
}

module.exports = insertCountries;
