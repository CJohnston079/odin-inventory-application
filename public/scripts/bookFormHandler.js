import enableAutoComplete from "./enableAutoComplete.js";
import enableAutoCompleteMulti from "./enableAutoCompleteMulti.js";
import { formatGenreStr } from "./utils.js";
import { joinArrWithConjunctions } from "./utils.js";
import { validateTitle } from "./validateInputs.js";
import { validateAuthor } from "./validateInputs.js";
import { validateGenres } from "./validateInputs.js";

const form = document.querySelector("#new-book");
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

	const bookAvailable = await validateTitle(titleInput.value, author);

	if (!bookAvailable) {
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

	const authorExists = await validateAuthor(author);

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

	const { areGenresValid, notFoundGenres } = await validateGenres(genresInput.value);

	if (areGenresValid) {
		genresMessage.textContent = "";
	} else {
		const genreMessageStr = joinArrWithConjunctions(notFoundGenres);
		genresMessage.textContent = formatGenreStr(genreMessageStr);

		const newGenreAnchor = document.createElement("a");
		newGenreAnchor.href = "../genres/new";
		newGenreAnchor.textContent = `Add genre +`;
		genresMessage.appendChild(newGenreAnchor);
	}
};

const handleSubmit = async function (e) {
	e.preventDefault();

	const isTitleValid = await validateTitle(titleInput.value, authorInput.value);
	const isAuthorValid = await validateAuthor(authorInput.value);
	const { areGenresValid } = await validateGenres(genresInput.value);

	if (isTitleValid && isAuthorValid && areGenresValid) {
		e.target.submit();
	}
};

titleInput.addEventListener("blur", handleTitleInput);
authorInput.addEventListener("blur", handleTitleInput);
authorInput.addEventListener("blur", handleAuthorInput);
genresInput.addEventListener("blur", handleGenresInput);

form.addEventListener("submit", async e => {
	handleSubmit(e);
});
