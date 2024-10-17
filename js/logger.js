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

exports.summary = function (data) {
	this.separator();
	console.log(chalk.blue("[SUMMARY]\n"));
	printSummary("countries", data.countriesAddedCount, data.countriesFailed);
	printSummary("authors", data.authorsAddedCount, data.authorsFailed);
	printSummary("genres", data.genresAddedCount, data.genresFailed);
	printSummary("books", data.booksAddedCount, data.booksFailed);
};

const printSummary = function (table, successCount, failed) {
	console.log(table.toUpperCase());
	console.log(chalk.bold(`├ inserted: ${chalk.green(successCount)}`));
	console.log(chalk.bold(`└── failed: ${chalk.red(failed.length)}`));
	if (failed.length > 0) {
		console.log(chalk.red(`\t  - ${failed.join(`\n\t  - `)}`));
	}
};
