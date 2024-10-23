import { formatGenreStr } from "../../utils.js";
import { joinArrWithConjunctions } from "../../utils.js";
import { checkGenresExists } from "../../validateInputs.js";

const validateGenres = async function (genresInput) {
	const genresMessage = document.querySelector(`#${genresInput.id} ~ .field-message`);

	if (!genresInput.value) {
		genresMessage.textContent = "";
		return false;
	}

	const { doAllGenresExist, notFoundGenres } = await checkGenresExists(genresInput.value);

	if (doAllGenresExist) {
		genresMessage.textContent = "";
	} else {
		const genreMessageStr = joinArrWithConjunctions(notFoundGenres);
		genresMessage.textContent = formatGenreStr(genreMessageStr);

		const newGenreAnchor = document.createElement("a");
		newGenreAnchor.href = "../genres/new";
		newGenreAnchor.textContent = `Add genre +`;
		genresMessage.appendChild(newGenreAnchor);
	}

	return doAllGenresExist;
};

export default validateGenres;
