const validateFieldLength = function (input, { maxLength, minLength = 0 }) {
	const validationElement = document.querySelector(`#${input.id} ~ .field-message`);
	const validationMessage = validationElement.querySelector(".message-content");

	if (!input.value) {
		validationMessage.textContent = "";
		validationElement.classList.add("display-none");
		return false;
	}

	const isTooLong = input.value.length > maxLength;
	const isTooShort = input.value.length < minLength;

	if (isTooLong) {
		validationElement.classList.remove("display-none");
		validationMessage.textContent = `Please enter a value of ${maxLength} or fewer characters.`;
	} else if (isTooShort) {
		validationElement.classList.remove("display-none");
		validationMessage.textContent = `Please enter a value of ${minLength} or more characters.`;
	} else {
		validationMessage.textContent = "";
		validationElement.classList.add("display-none");
	}

	return !isTooLong && !isTooShort;
};

export default validateFieldLength;
