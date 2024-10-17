const chalk = require("chalk");

exports.separator = function () {
	const width = process.stdout.columns || 80;
	console.log("-".repeat(width));
};

exports.info = function (message) {
	this.separator();
	console.log(chalk.blue(`[INFO]  ${message}`));
};

exports.error = function (message, err) {
	this.separator();
	console.error(chalk.red(`[ERROR] ${message}`));

	if (err) {
		console.error("> ", err);
	}
};

exports.summary = function (message) {
	this.separator();
	console.log(chalk.cyan("[SUMMARY]") + `\n> ${message}`);
};
