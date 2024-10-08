const db = require("../db/queries/index");

exports.getAllCountries = async function (req, res) {
	const countries = await db.countries.getAllCountries();
	res.render("./countries/countries", { title: "Countries", countries });
};
