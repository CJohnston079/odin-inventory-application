import validateFieldLength from "./validateFieldLength.js";
import { checkBookByAuthorExists } from "../../validateInputs.js";
import { strToNameCase } from "../../utils.js";
import { strToTitleCase } from "../../utils.js";

const validateTitle = async function (titleInput, authorInput, currentTitle = null) {
	const validationElement = document.querySelector(`#${titleInput.id} ~ .form__field-message`);
	const validationMessage = validationElement.querySelector(".form__field-message-content");
	const isTooLong = !validateFieldLength(titleInput, { maxLength: 64 });

	if (isTooLong) {
		return;
	}

	if (!authorInput.value) {
		validationMessage.textContent = "";
		validationElement.classList.add("display-none", "animation-none");
		return false;
	}

	const bookAvailable =
		currentTitle === titleInput.value ||
		!(await checkBookByAuthorExists(titleInput.value, authorInput.value));

	if (!bookAvailable) {
		validationElement.classList.remove("display-none", "animation-none");
		validationMessage.textContent = `
      ${strToTitleCase(titleInput.value)} by ${strToNameCase(authorInput.value)} is already added.
    `;
	} else {
		validationMessage.textContent = "";
		validationElement.classList.add("display-none", "animation-none");
	}

	return bookAvailable;
};

export default validateTitle;
