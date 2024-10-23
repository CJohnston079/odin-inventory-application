import { checkYearNotInFuture } from "../../validateInputs.js";

const validateYear = function (yearInput) {
	const yearMessage = document.querySelector(`#${yearInput.id} ~ .field-message`);
	const isYearValid = checkYearNotInFuture(Number(yearInput.value));
	const fieldName =
		yearInput.id.charAt(0).toUpperCase() + yearInput.id.toLowerCase().slice(1).replaceAll("-", " ");

	if (isYearValid) {
		yearMessage.textContent = "";
	} else {
		yearMessage.textContent = `${fieldName} cannot be in the future.`;
	}

	return isYearValid;
};

export default validateYear;
