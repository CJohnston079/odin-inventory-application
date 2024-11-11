const validateTextarea = function (descriptionInput, maxChars = 280) {
	const validationElement = document.querySelector(`#${descriptionInput.id} ~ .field-message`);
	const validationMessage = validationElement.querySelector(".message-content");
	const charCountElement = document.querySelector(`#${descriptionInput.id} ~ .char-count`);
	const charCount = descriptionInput.value.length;
	const isDescriptionValid = charCount <= maxChars;

	charCountElement.textContent = `${charCount}/${maxChars}`;
	charCountElement.classList.toggle("limit-exceeded", !isDescriptionValid);

	if (isDescriptionValid) {
		validationMessage.textContent = "";
		validationElement.classList.add("display-none");
	} else {
		validationElement.classList.remove("display-none");
		validationMessage.textContent = "Character limit exceeded";
	}

	return isDescriptionValid;
};

export default validateTextarea;
