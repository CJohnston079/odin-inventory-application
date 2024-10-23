export const checkBookByAuthorExists = async function (title, author) {
	if (!title || !author) {
		return false;
	}

	const base = "/books/check-title";
	const query = `title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}`;

	try {
		const response = await fetch(`${base}?${query}`);
		const data = await response.json();

		return data.exists;
	} catch (err) {
		console.error(`Error fetching from endpoint "${base}?title=${title}&author${author}":`, err);
		return false;
	}
};

export const checkAuthorExists = async function (author) {
	if (!author || author === "") {
		return false;
	}

	const base = "/authors/check-author";
	const query = `author=${encodeURIComponent(author)}`;

	try {
		const response = await fetch(`${base}?${query}`);
		const data = await response.json();

		return data.exists;
	} catch (err) {
		console.error(`Error fetching from endpoint "${base}?author=${author}":`, err);
		return false;
	}
};

export const checkGenreExists = async function (genre) {
	if (!genre) {
		return false;
	}

	const base = "/genres/check-genre";
	const query = `genre=${encodeURIComponent(genre)}`;

	try {
		const response = await fetch(`${base}?${query}`);
		const data = await response.json();

		return data.exists;
	} catch (err) {
		console.error(`Error fetching from endpoint "${base}?genre=${genre}":`, err);
		return false;
	}
};

export const checkNationalityExists = async function (nationality) {
	if (!nationality || nationality === "") {
		return false;
	}

	const base = "/countries/check-nationality";
	const query = `nationality=${encodeURIComponent(nationality)}`;

	try {
		const response = await fetch(`${base}?${query}`);
		const data = await response.json();

		return data.exists;
	} catch (err) {
		console.error(`Error fetching from endpoint "${base}?nationality=${nationality}`, err);
		return false;
	}
};

export const checkGenresExists = async function (genresInput) {
	const genresArr = genresInput
		.replace(/,\s*$/, "")
		.split(",")
		.map(genre => genre.trim());

	const checkedGenres = await Promise.all(
		genresArr.map(async genre => {
			const exists = await checkGenreExists(genre);
			return !exists ? genre : null;
		})
	);

	const notFoundGenres = checkedGenres.filter(genre => genre !== null);
	const doAllGenresExist = notFoundGenres.length === 0;

	return { doAllGenresExist, notFoundGenres };
};

export const checkYearNotInFuture = function (year) {
	const currentYear = new Date().getFullYear();

	return year <= currentYear;
};
