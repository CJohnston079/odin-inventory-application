export const doesBookExistByAuthor = async function (title, author) {
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

export const doesAuthorExist = async function (author) {
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

export const doesGenreExist = async function (genre) {
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

export const doesNationalityExist = async function (nationality) {
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
