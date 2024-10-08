import enableAutoComplete from "./enableAutoComplete.js";
import { validateAuthorName } from "./validateInputs.js";

const form = document.querySelector("#new-author");

const firstNameInput = document.querySelector("#first-name");
const lastNameInput = document.querySelector("#last-name");
const yearInput = document.querySelector("#birth-year");
const nationalityInput = document.querySelector("#nationality");

const validationState = { name: null };

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

firstNameInput.addEventListener("blur", handleNameInput);
lastNameInput.addEventListener("blur", handleNameInput);

const inputs = [
	{ element: firstNameInput, blurHandler: handleNameInput, validationKey: "name" },
	{ element: lastNameInput, blurHandler: handleNameInput, validationKey: "name" },
];

inputs.forEach(({ element, blurHandler, validationKey }) => {
	element.addEventListener("blur", blurHandler);
	element.addEventListener("input", () => (validationState[validationKey] = null));
});
