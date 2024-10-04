import enableAutoComplete from "./enableAutoComplete.js";
import enableAutoCompleteMulti from "./enableAutoCompleteMulti.js";
import { formatGenreStr } from "./utils.js";
import { joinArrWithConjunctions } from "./utils.js";
import { validateTitle } from "./validateInputs.js";
import { validateAuthor } from "./validateInputs.js";
import { validateGenres } from "./validateInputs.js";
import { validateYear } from "./validateInputs.js";

const form = document.querySelector("#new-book");

const titleInput = document.querySelector("#title");
const authorInput = document.querySelector("#author");
const genresInput = document.querySelector("#genres");
const yearInput = document.querySelector("#publication-year");

const validationState = { title: null, author: null, genres: null, year: null };

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

	validationState.title = bookAvailable;

	if (!bookAvailable) {
		titleMessage.textContent = `${book} by ${author} is already added.`;
	} else {
		titleMessage.textContent = "";
		validationState.title = true;
	}

	return bookAvailable;
};

const handleAuthorInput = async function () {
	const authorMessage = document.querySelector("#author + .field-message");
	const author = authorInput.value;

	if (!author) {
		authorMessage.textContent = "";
		return;
	}

	const authorExists = await validateAuthor(author);

	validationState.author = authorExists;

	if (authorExists) {
		authorMessage.textContent = "";
	} else {
		authorMessage.textContent = `Author ${author} not found.`;

		const newAuthorAnchor = document.createElement("a");

		newAuthorAnchor.href = "../authors/new";
		newAuthorAnchor.textContent = `Add author +`;
		authorMessage.appendChild(newAuthorAnchor);
	}

	return authorExists;
};

const handleGenresInput = async function () {
	const genresMessage = document.querySelector("#genres + .field-message");
	const genresInputVal = genresInput.value;

	if (!genresInputVal) {
		genresMessage.textContent = "";
		return;
	}

	const { areGenresValid, notFoundGenres } = await validateGenres(genresInput.value);

	validationState.genres = areGenresValid;

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

	return areGenresValid;
};

const handleYearInput = function () {
	const yearMessage = document.querySelector("#publication-year + .field-message");
	const year = yearInput.value;
	console.log(`Validating year ${year}`);

	const isYearValid = validateYear(Number(year));

	validationState.year = isYearValid;

	if (isYearValid) {
		yearMessage.textContent = "";
	} else {
		yearMessage.textContent = "Publication year cannot be in the future.";
	}

	return isYearValid;
};

const handleSubmit = async function (e) {
	e.preventDefault();

	const validators = {
		year: handleYearInput,
		author: handleAuthorInput,
		title: handleTitleInput,
		genres: handleGenresInput,
	};

	for (const [field, validator] of Object.entries(validators)) {
		if (validationState[field]) {
			continue;
		}

		const isValid = await validator();

		if (!isValid) {
			return;
		}
	}

	const isFormValid = Object.values(validationState).every(Boolean);

	if (isFormValid) {
		e.target.submit();
	}
};

titleInput.addEventListener("blur", handleTitleInput);
authorInput.addEventListener("blur", handleTitleInput);
authorInput.addEventListener("blur", handleAuthorInput);
genresInput.addEventListener("blur", handleGenresInput);
yearInput.addEventListener("blur", handleYearInput);

form.addEventListener("submit", async e => {
	handleSubmit(e);
});
