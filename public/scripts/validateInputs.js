import { sanitiseStr } from "./utils.js";

const checkInputInArray = function (input, arr) {
	const isInArray = arr.map(sanitiseStr).includes(sanitiseStr(input));
	return isInArray;
};

export const validateAuthor = function (author, authors) {
	const isInDatabase = checkInputInArray(author, authors);

	if (!isInDatabase) {
		return `Author ${author} not found.`;
	}
};

export const validateGenres = function (genresInput, genres) {
	const genresArr = genresInput
		.replace(/,\s*$/, "")
		.split(",")
		.map(genre => genre.trim());

	const notFoundGenres = genresArr.filter(input => !checkInputInArray(input, genres));

	if (notFoundGenres.length > 0) {
		let formattedGenres = "";

		if (notFoundGenres.length === 2) {
			formattedGenres += notFoundGenres.join(" and ");
		} else if (notFoundGenres.length > 2) {
			const lastGenre = notFoundGenres.pop();
			formattedGenres += `${notFoundGenres.join(", ")}, and ${lastGenre}`;
		} else {
			formattedGenres += notFoundGenres[0];
		}

		return `Genre${notFoundGenres.length > 1 ? "s" : ""} ${formattedGenres} not found.`;
	}
};
