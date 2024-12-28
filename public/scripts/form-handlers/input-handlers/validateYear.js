import { checkYearNotInFuture } from "../../validateInputs.js";

const validateYear = function (yearInput) {
	const validationElement = document.querySelector(`#${yearInput.id} ~ .form__field-message`);
	const validationMessage = validationElement.querySelector(".form__field-message-content");
	const isYearValid = checkYearNotInFuture(Number(yearInput.value));
	const fieldName =
		yearInput.id.charAt(0).toUpperCase() + yearInput.id.toLowerCase().slice(1).replaceAll("-", " ");

	if (isYearValid) {
		validationMessage.textContent = "";
		validationElement.classList.add("display-none", "animation-none");
	} else {
		validationElement.classList.remove("display-none", "animation-none");
		validationMessage.textContent = `${fieldName} cannot be in the future.`;
	}

	return isYearValid;
};

export default validateYear;
