import { doesBookExistByAuthor } from "./checkDatabase.js";
import { doesAuthorExist } from "./checkDatabase.js";
import { doesGenreExist } from "./checkDatabase.js";
import { doesNationalityExist } from "./checkDatabase.js";

export const validateTitle = async function (book, author) {
	const titleUnavailable = await doesBookExistByAuthor(book, author);

	return !titleUnavailable;
};

export const validateAuthor = async function (author) {
	const authorExists = await doesAuthorExist(author);

	return authorExists;
};

export const validateAuthorName = async function (author) {
	const authorExists = await doesAuthorExist(author);

	return !authorExists;
};

export const validateGenres = async function (genresInput) {
	const genresArr = genresInput
		.replace(/,\s*$/, "")
		.split(",")
		.map(genre => genre.trim());

	const checkedGenres = await Promise.all(
		genresArr.map(async genre => {
			const exists = await doesGenreExist(genre);
			return !exists ? genre : null;
		})
	);
	const notFoundGenres = checkedGenres.filter(genre => genre !== null);

	return { areGenresValid: notFoundGenres.length === 0, notFoundGenres };
};

export const validateYear = function (year) {
	const currentYear = new Date().getFullYear();

	return year <= currentYear;
};

export const validateNationality = async function (nationality) {
	const nationalityExists = await doesNationalityExist(nationality);

	return nationalityExists;
};
