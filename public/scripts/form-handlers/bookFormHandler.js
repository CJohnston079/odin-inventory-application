import enableAutoComplete from "../enableAutoComplete.js";
import enableAutoCompleteMulti from "../enableAutoCompleteMulti.js";
import validateAuthor from "./input-handlers/validateAuthor.js";
import validateGenres from "./input-handlers/validateGenres.js";
import validateTextarea from "./input-handlers/validateTextarea.js";
import validateTitle from "./input-handlers/validateTitle.js";
import validateYear from "./input-handlers/validateYear.js";
import handleSubmit from "./submit-handlers/handleSubmit.js";
import submitOnEnter from "./submit-handlers/submitOnEnter.js";

// enables auto-complete
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

// enables form validation and submission
const form = document.querySelector("#new-book");
const titleInput = document.querySelector("#title");
const authorInput = document.querySelector("#author");
const genresInput = document.querySelector("#genres");
const yearInput = document.querySelector("#publication-year");
const descriptionInput = document.querySelector("#description");

const validationState = { title: null, author: null, genres: null, year: null, description: null };

const validators = {
	year: () => validateYear(yearInput),
	author: async () => await validateAuthor(authorInput),
	title: async () => await validateTitle(titleInput, authorInput),
	genres: async () => await validateGenres(genresInput),
	description: () => validateTextarea(descriptionInput),
};

const inputs = [
	{ inputElement: titleInput, validationKey: "title" },
	{ inputElement: authorInput, validationKey: "title" },
	{ inputElement: authorInput, validationKey: "author" },
	{ inputElement: genresInput, validationKey: "genres" },
	{ inputElement: yearInput, validationKey: "year" },
];

inputs.forEach(({ inputElement, validationKey }) => {
	const validator = validators[validationKey];

	inputElement.addEventListener("blur", async () => {
		validationState[validationKey] = await validator();
	});
	inputElement.addEventListener("input", () => {
		validationState[validationKey] = null;
	});
});

descriptionInput.addEventListener("input", () => {
	validationState.description = validateTextarea(descriptionInput);
});

descriptionInput.addEventListener("keydown", async e => {
	await submitOnEnter(e, { form, validationState, validators });
});

form.addEventListener("submit", async e => {
	await handleSubmit(e, { form, validationState, validators });
});
