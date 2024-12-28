const validateTextarea = function (descriptionInput, maxChars = 280) {
	const validationElement = document.querySelector(
		`#${descriptionInput.id} ~ .form__field-message`
	);
	const validationMessage = validationElement.querySelector(".form__field-message-content");
	const charCountElement = document.querySelector(`#${descriptionInput.id} ~ .form__char-count`);
	const charCount = descriptionInput.value.length;
	const isDescriptionValid = charCount <= maxChars;

	charCountElement.textContent = `${charCount}/${maxChars}`;
	charCountElement.classList.toggle("form__char-count--limit-exceeded", !isDescriptionValid);

	if (isDescriptionValid) {
		validationMessage.textContent = "";
		validationElement.classList.add("display-none", "animation-none");
	} else {
		validationElement.classList.remove("display-none", "animation-none");
		validationMessage.textContent = "Character limit exceeded";
	}

	return isDescriptionValid;
};

export default validateTextarea;
