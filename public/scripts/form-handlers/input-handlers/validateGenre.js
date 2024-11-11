import validateFieldLength from "./validateFieldLength.js";
import { checkGenreExists } from "../../validateInputs.js";
import { strToTitleCase } from "../../utils.js";

const validateGenre = async function (genreInput, currentName = null) {
	const validationElement = document.querySelector(`#${genreInput.id} ~ .field-message`);
	const validationMessage = validationElement.querySelector(".message-content");
	const isTooLong = !validateFieldLength(genreInput, { maxLength: 32 });

	if (isTooLong) {
		return;
	}

	if (!genreInput.value) {
		validationMessage.textContent = "";
		validationElement.classList.add("display-none");
		return false;
	}

	const genreAvailable =
		currentName === genreInput.value || !(await checkGenreExists(genreInput.value));

	if (genreAvailable) {
		validationMessage.textContent = "";
		validationElement.classList.add("display-none");
	} else {
		validationElement.classList.remove("display-none");
		validationMessage.textContent = `${strToTitleCase(genreInput.value)} is already added.`;
	}

	return genreAvailable;
};

export default validateGenre;
