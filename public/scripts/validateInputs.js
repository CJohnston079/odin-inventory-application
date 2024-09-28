import { sanitiseStr } from "./utils.js";

const checkInputInArray = function (input, arr) {
	const isInArray = arr.map(sanitiseStr).includes(sanitiseStr(input));
	return isInArray;
};

export const validateAuthor = function (author, authors) {
	const isInDatabase = checkInputInArray(author, authors);

	if (!isInDatabase) {
		return "Author not found";
	}
};

export const validateGenres = function (genresInput, genres) {
	const isInDatabase = genresInput
		.replace(/,\s*$/, "")
		.split(",")
		.every(input => checkInputInArray(input, genres));

	if (!isInDatabase) {
		return "Genre(s) not found";
	}
};
