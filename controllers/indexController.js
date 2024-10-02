const db = require("../db/queries/index");
const nationalities = require("../db/data/nationalities");

exports.getIndex = function (req, res) {
	res.render("index", { title: "Home" });
};
