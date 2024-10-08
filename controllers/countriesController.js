const db = require("../db/queries/index");

exports.getAllCountries = async function (req, res) {
	const countries = await db.countries.getAllCountries();
	res.render("./countries/countries", { title: "Countries", countries });
};

exports.getNationalityNames = async function (req, res) {
	const nationalities = await db.countries.getNationalityNames();
	res.json({ nationalities });
};
