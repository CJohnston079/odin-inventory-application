const db = require("../db/queries/queries");

exports.getAllDecades = async function (req, res) {
	const data = await db.getAllDecades();
	const centuries = {};

	data.forEach(entry => {
		const decade = Number(entry.decade.replace("s", ""), 10);
		const century = Math.floor(decade / 100) * 100;

		if (!centuries[century]) {
			centuries[century] = [];
		}

		centuries[century].push(entry);
	});
	res.render("allDecades", { title: "Decades", centuries });
};

exports.getBooksByDecade = async function (req, res) {
	const decade = req.params.decade;
	const decadeNum = Number(decade.replace(/\D/g, ""));
	const books = await db.getBooksByDecade(decadeNum);
	res.render("decade", { title: "Decades", decade, books });
};
