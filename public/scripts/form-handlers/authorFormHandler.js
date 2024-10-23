import enableAutoComplete from "../enableAutoComplete.js";
import { checkAuthorExists } from "../validateInputs.js";
import { checkYearNotInFuture } from "../validateInputs.js";
import { checkNationalityExists } from "../validateInputs.js";

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

const validateName = async function (firstNameInput, lastNameInput) {
	const nameMessage = document.querySelector(`#${firstNameInput.id} ~ .field-message`);

	if (!firstNameInput.value || !lastNameInput.value) {
		nameMessage.textContent = "";
		return false;
	}

	const name = `${firstNameInput.value} ${lastNameInput.value}`;
	const nameAvailable = !(await checkAuthorExists(name));

	if (nameAvailable) {
		nameMessage.textContent = "";
	} else {
		nameMessage.textContent = `${name} already added.`;
	}

	return nameAvailable;
};

const validateYear = function (yearInput) {
	const yearMessage = document.querySelector(`#${yearInput.id} ~ .field-message`);
	const isYearValid = checkYearNotInFuture(Number(yearInput.value));
	const fieldName =
		yearInput.id.charAt(0).toUpperCase() + yearInput.id.toLowerCase().slice(1).replaceAll("-", " ");

	if (isYearValid) {
		yearMessage.textContent = "";
	} else {
		yearMessage.textContent = `${fieldName} cannot be in the future.`;
	}

	return isYearValid;
};

const validateNationality = async function (nationalityInput) {
	const nationalityMessage = document.querySelector(`#${nationalityInput.id} ~ .field-message`);
	const isNationalityValid = await checkNationalityExists(nationalityInput.value);

	if (isNationalityValid) {
		nationalityMessage.textContent = "";
	} else {
		nationalityMessage.textContent = `Nationality ${nationalityInput.value} not found.`;
	}

	return isNationalityValid;
};

const validateTextarea = function (descriptionInput, maxChars = 280) {
	const descriptionMessage = document.querySelector(`#${descriptionInput.id} ~ .field-message`);
	const charCountElement = document.querySelector(`#${descriptionInput.id} ~ .char-count`);
	const charCount = descriptionInput.value.length;
	const isDescriptionValid = charCount <= maxChars;

	charCountElement.textContent = `${charCount}/${maxChars}`;
	charCountElement.classList.toggle("limit-exceeded", !isDescriptionValid);

	descriptionMessage.textContent = isDescriptionValid ? "" : "Character limit exceeded";

	return isDescriptionValid;
};

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
