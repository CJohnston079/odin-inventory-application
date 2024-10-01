import { sanitiseStr } from "./utils.js";

const checkInputInArray = function (input, arr) {
	const isInArray = arr.map(sanitiseStr).includes(sanitiseStr(input));
	return isInArray;
};

export const checkAuthor = async function (author) {
	if (!author || author === "") {
		return;
	}

	try {
		const url = `check-author?author=${encodeURIComponent(author)}`;
		const response = await fetch(url, { mode: "cors" });
		const data = await response.json();

		return data.exists;
	} catch (err) {
		console.error(`Error checking author ${author}:`, err);
	}
};

export const checkBookTitle = async function (title, author) {
	if (!title || !author) {
		return;
	}

	try {
		const url = `check-title?title=${encodeURIComponent(title)}${
			author ? `&author=${encodeURIComponent(author)}` : ""
		}`;
		const response = await fetch(url, { mode: "cors" });
		const data = await response.json();

		return data.exists;
	} catch (err) {
		console.error(`Error checking book ${title} by ${author}:`, err);
	}
};

export const validateAuthor = async function (author) {
	const authorExists = await checkAuthor(author);

	return !authorExists;
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
