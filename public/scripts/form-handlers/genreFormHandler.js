import validateGenre from "./input-handlers/validateGenre.js";
import validateTextarea from "./input-handlers/validateTextarea.js";
import handleSubmit from "./submit-handlers/handleSubmit.js";
import submitOnEnter from "./submit-handlers/submitOnEnter.js";

const form = document.querySelector("#new-genre");
const genreInput = document.querySelector("#genre");
const descriptionInput = document.querySelector("#description");

const validationState = { genre: null, description: null };

const validators = {
	genre: async () => await validateGenre(genreInput),
	description: () => validateTextarea(descriptionInput),
};

const inputs = [{ inputElement: genreInput, validationKey: "genre" }];

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
