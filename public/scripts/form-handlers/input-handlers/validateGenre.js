import { checkGenreExists } from "../../validateInputs.js";
import { strToTitleCase } from "../../utils.js";

const validateGenre = async function (genreInput, currentName = null) {
	const genreMessage = document.querySelector(`#${genreInput.id} ~ .field-message`);

	if (!genreInput.value) {
		genreMessage.textContent = "";
		return false;
	}

	const genreAvailable =
		currentName === genreInput.value || !(await checkGenreExists(genreInput.value));

	if (genreAvailable) {
		genreMessage.textContent = "";
	} else {
		genreMessage.textContent = `${strToTitleCase(genreInput.value)} is already added.`;
	}

	return genreAvailable;
};

export default validateGenre;
