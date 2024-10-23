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

const validateTitle = async function (titleInput, authorInput) {
	const titleMessage = document.querySelector(`#${titleInput.id} ~ .field-message`);

	if (!authorInput.value) {
		titleMessage.textContent = "";
		return false;
	}

	const bookAvailable = !(await checkBookByAuthorExists(titleInput.value, authorInput.value));

	if (!bookAvailable) {
		titleMessage.textContent = `${titleInput.value} by ${authorInput.value} is already added.`;
	} else {
		titleMessage.textContent = "";
	}

	return bookAvailable;
};

const validateAuthor = async function (authorInput) {
	const authorMessage = document.querySelector(`#${authorInput.id} ~ .field-message`);

	if (!authorInput.value) {
		authorMessage.textContent = "";
		return false;
	}

	const authorExists = await checkAuthorExists(authorInput.value);

	if (authorExists) {
		authorMessage.textContent = "";
	} else {
		authorMessage.textContent = `Author ${authorInput.value} not found.`;

		const newAuthorAnchor = document.createElement("a");
		newAuthorAnchor.href = "../authors/new";
		newAuthorAnchor.textContent = `Add author +`;
		authorMessage.appendChild(newAuthorAnchor);
	}

	return authorExists;
};

const validateGenres = async function (genresInput) {
	const genresMessage = document.querySelector(`#${genresInput.id} ~ .field-message`);

	if (!genresInput.value) {
		genresMessage.textContent = "";
		return false;
	}

	const { doAllGenresExist, notFoundGenres } = await checkGenresExists(genresInput.value);

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

const validateYear = function (yearInput) {
	const yearMessage = document.querySelector(`#${yearInput.id} ~ .field-message`);
	const isYearValid = checkYearNotInFuture(Number(yearInput.value));

	if (isYearValid) {
		yearMessage.textContent = "";
	} else {
		yearMessage.textContent = "Publication year cannot be in the future.";
	}

	return isYearValid;
};

const validateTextarea = function (descriptionInput) {
	const descriptionMessage = document.querySelector(`#${descriptionInput.id} ~ .field-message`);
	const charCountElement = document.querySelector(`#${descriptionInput.id} ~ .char-count`);
	const charCount = descriptionInput.value.length;
	const isDescriptionValid = charCount <= 280;

	charCountElement.textContent = `${charCount}/280`;
	charCountElement.classList.toggle("limit-exceeded", !isDescriptionValid);

	descriptionMessage.textContent = isDescriptionValid ? "" : "Character limit exceeded";

	return isDescriptionValid;
};

const handleSubmit = async function (e) {
	e.preventDefault();

	const validators = {
		year: async () => validateYear(yearInput),
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
