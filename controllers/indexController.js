const db = require("../db/queries/queries");
const nationalities = require("../db/data/nationalities");

exports.getIndex = function (req, res) {
	res.render("index", { title: "Home" });
};
