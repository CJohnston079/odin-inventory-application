import { checkNationalityExists } from "../../validateInputs.js";

const validateNationality = async function (nationalityInput) {
	const validationElement = document.querySelector(
		`#${nationalityInput.id} ~ .form__field-message`
	);
	const validationMessage = validationElement.querySelector(".form__field-message-content");
	const isNationalityValid = await checkNationalityExists(nationalityInput.value);

	if (isNationalityValid) {
		validationMessage.textContent = "";
		validationElement.classList.add("display-none", "animation-none");
	} else {
		validationElement.classList.remove("display-none", "animation-none");
		validationMessage.textContent = `Nationality ${nationalityInput.value} not found.`;
	}

	return isNationalityValid;
};

export default validateNationality;
