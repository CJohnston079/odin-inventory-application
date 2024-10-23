import enableAutoComplete from "../enableAutoComplete.js";
import validateName from "./input-handlers/validateName.js";
import validateNationality from "./input-handlers/validateNationality.js";
import validateTextarea from "./input-handlers/validateTextarea.js";
import validateYear from "./input-handlers/validateYear.js";
import handleSubmit from "./submit-handlers/handleSubmit.js";
import submitOnEnter from "./submit-handlers/submitOnEnter.js";

// enables auto-complete
const nationalities = await fetch("../countries/nationality-names")
	.then(response => response.json())
	.then(data => data.nationalities);

enableAutoComplete({
	inputElementID: "nationality",
	suggestionListID: "nationality-suggestions",
	options: nationalities,
	fieldName: "nationality",
});

// enables form validation and submission
const form = document.querySelector("#new-author");
const firstNameInput = document.querySelector("#first-name");
const lastNameInput = document.querySelector("#last-name");
const yearInput = document.querySelector("#birth-year");
const nationalityInput = document.querySelector("#nationality");
const biographyInput = document.querySelector("#biography");

const validationState = { name: null, year: null, nationality: null, biography: null };

const validators = {
	name: async () => await validateName(firstNameInput, lastNameInput),
	year: () => validateYear(yearInput),
	nationality: async () => await validateNationality(nationalityInput),
	biography: () => validateTextarea(biographyInput),
};

const inputs = [
	{ inputElement: firstNameInput, validationKey: "name" },
	{ inputElement: lastNameInput, validationKey: "name" },
	{ inputElement: yearInput, validationKey: "year" },
	{ inputElement: nationalityInput, validationKey: "nationality" },
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

biographyInput.addEventListener("input", () => {
	validationState.biography = validateTextarea(biographyInput);
});

biographyInput.addEventListener("keydown", async e => {
	submitOnEnter(e, { form, validationState, validators });
});

form.addEventListener("submit", async e => {
	await handleSubmit(e, { form, validationState, validators });
});
