import enableAutoComplete from "../enableAutoComplete.js";
import enableAutoCompleteMulti from "../enableAutoCompleteMulti.js";
import { formatGenreStr } from "../utils.js";
import { joinArrWithConjunctions } from "../utils.js";
import { checkBookByAuthorExists } from "../validateInputs.js";
import { checkAuthorExists } from "../validateInputs.js";
import { checkGenresExists } from "../validateInputs.js";
import { checkYearNotInFuture } from "../validateInputs.js";

const form = document.querySelector("#new-book");
const titleInput = document.querySelector("#title");
const authorInput = document.querySelector("#author");
const genresInput = document.querySelector("#genres");
const yearInput = document.querySelector("#publication-year");
const descriptionInput = document.querySelector("#description");

const validationState = { title: null, author: null, genres: null, year: null, description: null };

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
	fieldName: "name",
	addNewRoute: "genres",
});

const handleTitleInput = async function () {
	if (validationState.title) {
		return;
	}

	const titleMessage = document.querySelector("#title ~ .field-message");
	const book = titleInput.value;
	const author = authorInput.value;

	if (!author) {
		titleMessage.textContent = "";
		return;
	}

	const bookAvailable = !(await checkBookByAuthorExists(titleInput.value, author));

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
	if (validationState.author) {
		return;
	}

	const authorMessage = document.querySelector("#author ~ .field-message");
	const author = authorInput.value;

	if (!author) {
		authorMessage.textContent = "";
		return;
	}

	const authorExists = await checkAuthorExists(author);

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
	if (validationState.genres) {
		return;
	}

	const genresMessage = document.querySelector("#genres ~ .field-message");
	const genresInputVal = genresInput.value;

	if (!genresInputVal) {
		genresMessage.textContent = "";
		return;
	}

	const { doAllGenresExist, notFoundGenres } = await checkGenresExists(genresInput.value);

	validationState.genres = doAllGenresExist;

	if (doAllGenresExist) {
		genresMessage.textContent = "";
	} else {
		const genreMessageStr = joinArrWithConjunctions(notFoundGenres);
		genresMessage.textContent = formatGenreStr(genreMessageStr);

		const newGenreAnchor = document.createElement("a");
		newGenreAnchor.href = "../genres/new";
		newGenreAnchor.textContent = `Add genre +`;
		genresMessage.appendChild(newGenreAnchor);
	}

	return doAllGenresExist;
};

const handleYearInput = function () {
	if (validationState.year) {
		return;
	}

	const yearMessage = document.querySelector("#publication-year ~ .field-message");
	const year = yearInput.value;

	const isYearValid = checkYearNotInFuture(Number(year));

	validationState.year = isYearValid;

	if (isYearValid) {
		yearMessage.textContent = "";
	} else {
		yearMessage.textContent = "Publication year cannot be in the future.";
	}

	return isYearValid;
};

const handleDescriptionInput = function () {
	const descriptionMessage = document.querySelector("#description ~ .field-message");
	const charCountElement = document.querySelector("#description ~ .char-count");
	const charCount = descriptionInput.value.length;
	const isDescriptionValid = charCount <= 280;

	validationState.description = isDescriptionValid;

	charCountElement.textContent = `${charCount}/280`;
	charCountElement.classList.toggle("limit-exceeded", !isDescriptionValid);

	descriptionMessage.textContent = isDescriptionValid ? "" : "Character limit exceeded";

	return isDescriptionValid;
};

const handleSubmit = async function (e) {
	e.preventDefault();

	const validators = {
		year: handleYearInput,
		author: handleAuthorInput,
		title: handleTitleInput,
		genres: handleGenresInput,
		description: handleDescriptionInput,
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
		form.submit();
	}
};

const submitOnEnter = async function (e) {
	if (e.key === "Enter") {
		e.preventDefault();
		await handleSubmit(e);
	}
};

const inputs = [
	{ element: titleInput, blurHandler: handleTitleInput, validationKey: "title" },
	{ element: authorInput, blurHandler: handleTitleInput, validationKey: "title" },
	{ element: authorInput, blurHandler: handleAuthorInput, validationKey: "author" },
	{ element: genresInput, blurHandler: handleGenresInput, validationKey: "genres" },
	{ element: yearInput, blurHandler: handleYearInput, validationKey: "year" },
];

inputs.forEach(({ element, blurHandler, validationKey }) => {
	element.addEventListener("blur", blurHandler);
	element.addEventListener("input", () => (validationState[validationKey] = null));
});

descriptionInput.addEventListener("input", handleDescriptionInput);
descriptionInput.addEventListener("keydown", submitOnEnter);

form.addEventListener("submit", handleSubmit);
