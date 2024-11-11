import { checkYearNotInFuture } from "../../validateInputs.js";

const validateYear = function (yearInput) {
	const validationElement = document.querySelector(`#${yearInput.id} ~ .field-message`);
	const validationMessage = validationElement.querySelector(".message-content");
	const isYearValid = checkYearNotInFuture(Number(yearInput.value));
	const fieldName =
		yearInput.id.charAt(0).toUpperCase() + yearInput.id.toLowerCase().slice(1).replaceAll("-", " ");

	if (isYearValid) {
		validationMessage.textContent = "";
		validationElement.classList.add("display-none");
	} else {
		validationElement.classList.add("display-none");
		validationMessage.textContent = `${fieldName} cannot be in the future.`;
	}

	return isYearValid;
};

export default validateYear;
