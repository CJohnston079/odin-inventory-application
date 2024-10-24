import { checkGenreExists } from "../../validateInputs.js";

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
		genreMessage.textContent = `${genreInput.value} is already added.`;
	}

	return genreAvailable;
};

export default validateGenre;
