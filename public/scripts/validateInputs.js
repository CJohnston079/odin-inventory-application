import { sanitiseStr } from "./utils.js";

const isInArray = (input, arr) => arr.map(sanitiseStr).includes(sanitiseStr(input));

export const doesBookExistByAuthor = async function (title, author) {
	if (!title || !author) {
		return false;
	}

	try {
		const base = "check-title";
		const query = `title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}`;
		const response = await fetch(`${base}?${query}`);
		const data = await response.json();

		return data.exists;
	} catch (err) {
		console.error(`Error checking book ${title} by ${author}:`, err);
		return false;
	}
};

export const doesAuthorExist = async function (author) {
	if (!author || author === "") {
		return false;
	}

	try {
		const response = await fetch(`check-author?author=${encodeURIComponent(author)}`);
		const data = await response.json();

		return data.exists;
	} catch (err) {
		console.error(`Error checking author ${author}:`, err);
		return false;
	}
};

export const doesGenreExist = async function (genre) {
	if (!genre) {
		return false;
	}

	try {
		const response = await fetch(`check-genre?genre=${encodeURIComponent(genre)}`);
		const data = await response.json();

		return data.exists;
	} catch (err) {
		console.error(`Error checking genre ${genre}:`, err);
		return false;
	}
};

export const validateAuthor = async function (author) {
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

	return notFoundGenres.length > 0;
};
