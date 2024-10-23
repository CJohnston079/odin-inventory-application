import { checkBookByAuthorExists } from "../../validateInputs.js";

const validateTitle = async function (titleInput, authorInput) {
	const titleMessage = document.querySelector(`#${titleInput.id} ~ .field-message`);

	if (!authorInput.value) {
		titleMessage.textContent = "";
		return false;
	}

	const bookAvailable = !(await checkBookByAuthorExists(titleInput.value, authorInput.value));

	if (!bookAvailable) {
		titleMessage.textContent = `${titleInput.value} by ${authorInput.value} is already added.`;
	} else {
		titleMessage.textContent = "";
	}

	return bookAvailable;
};

export default validateTitle;
