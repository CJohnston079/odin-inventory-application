import enableAutoComplete from "../enableAutoComplete.js";
import validateName from "./input-handlers/validateName.js";
import validateNationality from "./input-handlers/validateNationality.js";
import validateTextarea from "./input-handlers/validateTextarea.js";
import validateYear from "./input-handlers/validateYear.js";

const form = document.querySelector("#new-author");

const firstNameInput = document.querySelector("#first-name");
const lastNameInput = document.querySelector("#last-name");
const yearInput = document.querySelector("#birth-year");
const nationalityInput = document.querySelector("#nationality");
const biographyInput = document.querySelector("#biography");

const validationState = { name: null, year: null, nationality: null, biography: null };

const nationalities = await fetch("../countries/nationality-names")
	.then(response => response.json())
	.then(data => data.nationalities);

enableAutoComplete({
	inputElementID: "nationality",
	suggestionListID: "nationality-suggestions",
	options: nationalities,
	fieldName: "nationality",
});

const handleSubmit = async function (e) {
	e.preventDefault();

	const validators = {
		name: async () => validateName(firstNameInput, lastNameInput),
		year: async () => validateYear(yearInput),
		nationality: async () => validateNationality(nationalityInput),
		biography: async () => validateTextarea(biographyInput),
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
		element: firstNameInput,
		validationKey: "name",
		validator: async () => validateName(firstNameInput, lastNameInput),
	},
	{
		element: lastNameInput,
		validationKey: "name",
		validator: async () => validateName(firstNameInput, lastNameInput),
	},
	{
		element: yearInput,
		validationKey: "year",
		validator: async () => validateYear(yearInput),
	},
	{
		element: nationalityInput,
		validationKey: "nationality",
		validator: async () => validateNationality(nationalityInput),
	},
];

inputs.forEach(({ element, validator, validationKey }) => {
	element.addEventListener("blur", async () => {
		validationState[validationKey] = await validator();
	});
	element.addEventListener("input", () => {
		validationState[validationKey] = null;
	});
});

biographyInput.addEventListener("input", () => {
	validationState.biography = validateTextarea(biographyInput);
});
biographyInput.addEventListener("keydown", submitOnEnter);

form.addEventListener("submit", handleSubmit);
