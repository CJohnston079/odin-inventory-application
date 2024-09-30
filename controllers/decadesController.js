const db = require("../db/queries/queries");
const { groupDecadesByCentury } = require("../js/utils");

exports.getAllDecades = async function (req, res) {
	const decades = await db.getAllDecades();
	const centuries = groupDecadesByCentury(decades);
	res.render("./decades/decades", { title: "Decades", centuries });
};

exports.getBooksByDecade = async function (req, res) {
	const decade = req.params.decade;
	const decadeNum = Number(decade.replace(/\D/g, ""));
	const books = await db.getBooksByDecade(decadeNum);
	res.render("./decades/decade", { title: "Decades", decade, books });
};
