import { sanitiseStr } from "./utils.js";

const isInArray = (input, arr) => arr.map(sanitiseStr).includes(sanitiseStr(input));

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

export const validateAuthor = async function (author) {
	const authorExists = await doesAuthorExist(author);

	return !authorExists;
};

export const validateGenres = function (genresInput, genres) {
	const genresArr = genresInput
		.replace(/,\s*$/, "")
		.split(",")
		.map(genre => genre.trim());

	const notFoundGenres = genresArr.filter(input => !isInArray(input, genres));

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
