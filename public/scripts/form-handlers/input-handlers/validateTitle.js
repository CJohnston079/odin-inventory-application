import validateFieldLength from "./validateFieldLength.js";
import { checkBookByAuthorExists } from "../../validateInputs.js";
import { strToNameCase } from "../../utils.js";
import { strToTitleCase } from "../../utils.js";

const validateTitle = async function (titleInput, authorInput, currentTitle = null) {
	const titleMessage = document.querySelector(`#${titleInput.id} ~ .field-message`);
	const isTooLong = !validateFieldLength(titleInput, { maxLength: 64 });

	if (isTooLong) {
		return;
	}

	if (!authorInput.value) {
		titleMessage.textContent = "";
		return false;
	}

	const bookAvailable =
		currentTitle === titleInput.value ||
		!(await checkBookByAuthorExists(titleInput.value, authorInput.value));

	if (!bookAvailable) {
		titleMessage.textContent = `
      ${strToTitleCase(titleInput.value)} by ${strToNameCase(authorInput.value)} is already added.
    `;
	} else {
		titleMessage.textContent = "";
	}

	return bookAvailable;
};

export default validateTitle;
