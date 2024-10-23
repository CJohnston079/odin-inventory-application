import enableAutoComplete from "../enableAutoComplete.js";
import enableAutoCompleteMulti from "../enableAutoCompleteMulti.js";
import validateAuthor from "./input-handlers/validateAuthor.js";
import validateGenres from "./input-handlers/validateGenres.js";
import validateTextarea from "./input-handlers/validateTextarea.js";
import validateTitle from "./input-handlers/validateTitle.js";
import validateYear from "./input-handlers/validateYear.js";

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

const handleSubmit = async function (e) {
	e.preventDefault();

	const validators = {
		year: () => validateYear(yearInput),
		author: async () => validateAuthor(authorInput),
		title: async () => validateTitle(titleInput, authorInput),
		genres: async () => validateGenres(genresInput),
		description: async () => validateTextarea(descriptionInput),
	};

	for (const [field, validator] of Object.entries(validators)) {
		if (validationState[field]) {
			continue;
		}

		const isValid = await validator();
		validationState[field] = isValid;

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
	{
		inputElement: titleInput,
		validationKey: "title",
		validator: async () => validateTitle(titleInput, authorInput),
	},
	{
		inputElement: authorInput,
		validationKey: "title",
		validator: async () => validateTitle(titleInput, authorInput),
	},
	{
		inputElement: authorInput,
		validationKey: "author",
		validator: async () => validateAuthor(authorInput),
	},
	{
		inputElement: genresInput,
		validationKey: "genres",
		validator: async () => validateGenres(genresInput),
	},
	{
		inputElement: yearInput,
		validationKey: "year",
		validator: async () => validateYear(yearInput),
	},
];

inputs.forEach(({ inputElement, validationKey, validator }) => {
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
descriptionInput.addEventListener("keydown", submitOnEnter);

form.addEventListener("submit", handleSubmit);
