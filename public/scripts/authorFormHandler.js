import enableAutoComplete from "./enableAutoComplete.js";
import { validateAuthorName } from "./validateInputs.js";
import { validateYear } from "./validateInputs.js";
import { validateNationality } from "./validateInputs.js";

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

const handleNameInput = async function () {
	if (validationState.name) {
		return;
	}

	const nameMessage = document.querySelector("#first-name ~ .field-message");
	const firstName = firstNameInput.value;
	const lastName = lastNameInput.value;
	const name = `${firstName} ${lastName}`;

	if (!firstName || !lastName) {
		nameMessage.textContent = "";
		return;
	}

	const nameAvailable = await validateAuthorName(name);

	if (nameAvailable) {
		nameMessage.textContent = "";
		validationState.name = true;
	} else {
		nameMessage.textContent = `${name} already added.`;
	}

	return nameAvailable;
};

const handleYearInput = function () {
	if (validationState.year) {
		return;
	}

	const yearMessage = document.querySelector("#birth-year ~ .field-message");
	const year = yearInput.value;

	const isYearValid = validateYear(Number(year));

	validationState.year = isYearValid;

	if (isYearValid) {
		yearMessage.textContent = "";
	} else {
		yearMessage.textContent = "Birth   year cannot be in the future.";
	}

	return isYearValid;
};

const handleNationalityInput = async function () {
	if (validationState.nationality) {
		return;
	}

	const nationalityMessage = document.querySelector("#nationality ~ .field-message");
	const nationality = nationalityInput.value;

	const isNationalityValid = await validateNationality(nationality);

	validationState.nationality = isNationalityValid;

	if (!isNationalityValid) {
		nationalityMessage.textContent = `Nationality ${nationality} not found.`;
	} else {
		nationalityMessage.textContent = "";
	}
};

const handleBiographyInput = function () {
	const biographyMessage = document.querySelector("#biography ~ .field-message");
	const charCountElement = document.querySelector("#biography ~ .char-count");
	const charCount = biographyInput.value.length;
	const isBiographyValid = charCount <= 280;

	validationState.biography = isBiographyValid;

	charCountElement.textContent = `${charCount}/280`;
	charCountElement.classList.toggle("limit-exceeded", !isBiographyValid);

	biographyMessage.textContent = isBiographyValid ? "" : "Character limit exceeded";

	return isBiographyValid;
};

const handleSubmit = async function (e) {
	e.preventDefault();

	const validators = {
		name: handleNameInput,
		year: handleYearInput,
		nationality: handleNationalityInput,
		biography: handleBiographyInput,
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

const inputs = [
	{ element: firstNameInput, blurHandler: handleNameInput, validationKey: "name" },
	{ element: lastNameInput, blurHandler: handleNameInput, validationKey: "name" },
	{ element: yearInput, blurHandler: handleYearInput, validationKey: "year" },
	{ element: nationalityInput, blurHandler: handleNationalityInput, validationKey: "nationality" },
];

inputs.forEach(({ element, blurHandler, validationKey }) => {
	element.addEventListener("blur", blurHandler);
	element.addEventListener("input", () => (validationState[validationKey] = null));
});

biographyInput.addEventListener("input", handleBiographyInput);

form.addEventListener("submit", handleSubmit);
