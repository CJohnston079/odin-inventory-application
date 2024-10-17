const fs = require("fs").promises;
const path = require("path");
const logger = require("../../../js/logger");
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
				[country.slug, country.name, country.nationality, country.language]
			);
			successCount += 1;
		} catch (err) {
			logger.error(`Error inserting country ${JSON.stringify(country, null, 2)}`, err);
			failedCount += 1;
			continue;
		}
	}
	console.log(`> ${successCount} countries inserted successfully (${failedCount} failures)`);
}

module.exports = insertCountries;
