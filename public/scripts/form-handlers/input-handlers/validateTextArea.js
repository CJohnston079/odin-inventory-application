const validateTextarea = function (descriptionInput, maxChars = 280) {
	const descriptionMessage = document.querySelector(`#${descriptionInput.id} ~ .field-message`);
	const charCountElement = document.querySelector(`#${descriptionInput.id} ~ .char-count`);
	const charCount = descriptionInput.value.length;
	const isDescriptionValid = charCount <= maxChars;

	charCountElement.textContent = `${charCount}/${maxChars}`;
	charCountElement.classList.toggle("limit-exceeded", !isDescriptionValid);

	descriptionMessage.textContent = isDescriptionValid ? "" : "Character limit exceeded";

	return isDescriptionValid;
};

export default validateTextarea;
