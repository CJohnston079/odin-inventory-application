import enableAutoComplete from "./enableAutoComplete.js";
import enableAutoCompleteMulti from "./enableAutoCompleteMulti.js";
import { doesBookExistByAuthor } from "./validateInputs.js";
import { doesAuthorExist } from "./validateInputs.js";
import { doesGenreExist } from "./validateInputs.js";
import { validateAuthor } from "./validateInputs.js";
import { validateGenres } from "./validateInputs.js";

const titleInput = document.querySelector("#title");
const authorInput = document.querySelector("#author");
const genresInput = document.querySelector("#genres");
const yearInput = document.querySelector("#publication-year");

const authors = await fetch("../authors/author-names")
	.then(response => response.json())
	.then(data => data.authors);
const genres = await fetch("../genres/genre-names")
	.then(response => response.json())
	.then(data => data.genres);

enableAutoComplete({
	inputElementID: "author",
	suggestionListID: "author-suggestions",
	options: authors,
	fieldName: "name",
	addNewRoute: "authors",
});
enableAutoCompleteMulti({
	inputElementID: "genres",
	suggestionListID: "genre-suggestions",
	options: genres,
	fieldName: "genre_name",
	addNewRoute: "genres",
});

const handleTitleInput = async function () {
	const titleMessage = document.querySelector("#title + .field-message");
	const book = titleInput.value;
	const author = authorInput.value;

	if (!author) {
		titleMessage.textContent = "";
		return;
	}

	const bookExists = await doesBookExistByAuthor(titleInput.value, author);

	if (bookExists) {
		titleMessage.textContent = `${book} by ${author} is already added.`;
	} else {
		titleMessage.textContent = "";
	}
};

const handleAuthorInput = async function () {
	const authorMessage = document.querySelector("#author + .field-message");
	const author = authorInput.value;

	if (!author) {
		authorMessage.textContent = "";
		return;
	}

	const authorExists = await doesAuthorExist(author);

	if (authorExists) {
		authorMessage.textContent = "";
	} else {
		authorMessage.textContent = `Author ${author} not found.`;

		const newAuthorAnchor = document.createElement("a");

		newAuthorAnchor.href = "../authors/new";
		newAuthorAnchor.textContent = `Add author +`;
		authorMessage.appendChild(newAuthorAnchor);
	}
};

const handleGenresInput = async function () {
	const genresMessage = document.querySelector("#genres + .field-message");
	const genresInputVal = genresInput.value;

	if (!genresInputVal) {
		genresMessage.textContent = "";
		return;
	}

	const genresArr = genresInputVal
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

	if (notFoundGenres.length === 0) {
		genresMessage.textContent = "";
	} else {
		let genreMessageStr = "";

		if (notFoundGenres.length === 2) {
			genreMessageStr += notFoundGenres.join(" and ");
		} else if (notFoundGenres.length > 2) {
			const lastGenre = notFoundGenres.pop();
			genreMessageStr += `${notFoundGenres.join(", ")}, and ${lastGenre}`;
		} else {
			genreMessageStr += notFoundGenres[0];
		}

		genresMessage.textContent = `Genre${
			notFoundGenres.length > 1 ? "s" : ""
		} ${genreMessageStr} not found.`;

		const newGenreAnchor = document.createElement("a");
		newGenreAnchor.href = "../genres/new";
		newGenreAnchor.textContent = `Add genre +`;
		genresMessage.appendChild(newGenreAnchor);
	}
};

const handleSubmit = async function (e) {
	e.preventDefault();

	const [authorError, genresError] = await Promise.all([
		validateAuthor(authorInput.value),
		validateGenres(genresInput.value),
	]);

	if (!authorError && !genresError) {
		e.target.submit();
	}
};

document.querySelector("#title").addEventListener("blur", handleTitleInput);
document.querySelector("#author").addEventListener("blur", handleTitleInput);
document.querySelector("#author").addEventListener("blur", handleAuthorInput);
document.querySelector("#genres").addEventListener("blur", handleGenresInput);
document.querySelector("#new-book").addEventListener("submit", async e => {
	handleSubmit(e);
});
