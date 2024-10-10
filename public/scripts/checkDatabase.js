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
		console.error(`Error fetching from endpoint check-title?title=${title}&author${author}:`, err);
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
		console.error(`Error fetching from endpoint check-author?author=${author}:`, err);
		return false;
	}
};

export const doesGenreExist = async function (genre) {
	if (!genre) {
		return false;
	}

	try {
		const response = await fetch(`/books/check-genre?genre=${encodeURIComponent(genre)}`);
		const data = await response.json();

		return data.exists;
	} catch (err) {
		console.error(`Error fetching from endpoint books/check-genre?genre=${genre}:`, err);
		return false;
	}
};

export const doesNationalityExist = async function (nationality) {
	if (!nationality || nationality === "") {
		return false;
	}

	const query = `check-nationality?nationality=${encodeURIComponent(nationality)}`;

	try {
		const response = await fetch(query);
		const data = await response.json();

		return data.exists;
	} catch (err) {
		console.error(`Error fetching from endpoint check-nationality?nationality=${nationality}`, err);
		return false;
	}
};
