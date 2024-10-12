const db = require("../db/queries/index");
const { strToTitleCase } = require("../js/utils");

exports.getAllCountries = async function (req, res) {
	const countries = await db.countries.getAllCountries();
	res.render("./countries/countries", { title: "Countries", countries });
};

exports.getNationalityNames = async function (req, res) {
	const nationalities = await db.countries.getNationalityNames();
	res.json({ nationalities });
};

exports.getBooksByCountry = async function (req, res) {
	const country = req.params.country;
	const books = await db.books.getBooksByCountry(country);

	res.render("./countries/country", { title: "Countries", country, books });
};

exports.checkNationality = async function (req, res) {
	const nationality = strToTitleCase(req.query.nationality);

	if (!nationality) {
		return;
	}

	try {
		const exists = await db.countries.checkNationality(nationality);
		res.json({ exists, nationality });
	} catch (err) {
		console.error(`Error checking nationality ${nationality}.`, err);
		res.status(500).json({ error: "Server error" });
	}
};
