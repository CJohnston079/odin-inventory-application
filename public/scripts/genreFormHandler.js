import { validateGenre } from "./validateInputs.js";

const form = document.querySelector("#new-genre");
const genreInput = document.querySelector("#genre");
const descriptionInput = document.querySelector("#description");

const validationState = { genre: null, description: null };

const handleGenreInput = async function () {
	if (validationState.genre) {
		return;
	}

	const genreMessage = document.querySelector("#genre ~ .field-message");
	const genre = genreInput.value;

	if (!genre) {
		genreMessage.textContent = "";
		return;
	}

	const genreAvailable = await validateGenre(genre);

	validationState.genre = genreAvailable;

	if (!genreAvailable) {
		genreMessage.textContent = `${genre} is already added.`;
	} else {
		genreMessage.textContent = "";
		validationState.genre = true;
	}

	return genreAvailable;
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
		genre: handleGenreInput,
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

const inputs = [{ element: genreInput, blurHandler: handleGenreInput, validationKey: "genre" }];

inputs.forEach(({ element, blurHandler, validationKey }) => {
	element.addEventListener("blur", blurHandler);
	element.addEventListener("input", () => (validationState[validationKey] = null));
});

descriptionInput.addEventListener("input", handleDescriptionInput);
descriptionInput.addEventListener("keydown", submitOnEnter);

form.addEventListener("submit", handleSubmit);
