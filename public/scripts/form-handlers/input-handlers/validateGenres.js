import { formatGenreStr } from "../../utils.js";
import { joinArrWithConjunctions } from "../../utils.js";
import { checkGenresExists } from "../../validateInputs.js";

const validateGenres = async function (genresInput) {
	const validationElement = document.querySelector(`#${genresInput.id} ~ .form__field-message`);
	const validationMessage = validationElement.querySelector(".form__field-message-content");

	if (!genresInput.value) {
		validationMessage.textContent = "";
		validationElement.classList.add("display-none", "animation-none");
		return false;
	}

	const { doAllGenresExist, notFoundGenres } = await checkGenresExists(genresInput.value);

	if (doAllGenresExist) {
		validationMessage.textContent = "";
		validationElement.classList.add("display-none", "animation-none");
	} else {
		const genreMessageStr = joinArrWithConjunctions(notFoundGenres);
		validationElement.classList.remove("display-none", "animation-none");
		validationMessage.textContent = formatGenreStr(genreMessageStr);

		const newGenreAnchor = document.createElement("a");
		newGenreAnchor.href = "../genres/new";
		newGenreAnchor.textContent = `Add genre`;
		validationMessage.appendChild(newGenreAnchor);
	}

	return doAllGenresExist;
};

export default validateGenres;
