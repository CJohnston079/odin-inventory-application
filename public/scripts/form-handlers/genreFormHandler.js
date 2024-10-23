import { checkGenreExists } from "../validateInputs.js";

const form = document.querySelector("#new-genre");
const genreInput = document.querySelector("#genre");
const descriptionInput = document.querySelector("#description");

const validationState = { genre: null, description: null };

const validateGenre = async function (genreInput) {
	const genreMessage = document.querySelector(`#${genreInput.id} ~ .field-message`);

	if (!genreInput.value) {
		genreMessage.textContent = "";
		return false;
	}

	const genreAvailable = !(await checkGenreExists(genreInput.value));

	if (genreAvailable) {
		genreMessage.textContent = "";
	} else {
		genreMessage.textContent = `${genreInput.value} is already added.`;
	}

	return genreAvailable;
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
		genre: async () => validateGenre(genreInput),
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
		inputElement: genreInput,
		validationKey: "genre",
		validator: async () => validateGenre(genreInput),
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
