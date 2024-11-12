const validateFieldLength = function (input, { maxLength, minLength = 0 }) {
	const inputMessage = document.querySelector(`#${input.id} ~ .field-message`);

	if (!input.value) {
		inputMessage.textContent = "";
		return true;
	}

	const isTooLong = input.value.length > maxLength;
	const isTooShort = input.value.length < minLength;

	if (isTooLong) {
		inputMessage.textContent = `Please enter a value of ${maxLength} or fewer characters.`;
	} else if (isTooShort) {
		inputMessage.textContent = `Please enter a value of ${minLength} or more characters.`;
	} else {
		inputMessage.textContent = "";
	}

	return !isTooLong && !isTooShort;
};

export default validateFieldLength;
