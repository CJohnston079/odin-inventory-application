import validateFieldLength from "./validateFieldLength.js";
import { checkAuthorExists } from "../../validateInputs.js";
import { strToNameCase } from "../../utils.js";

const validateName = async function (firstNameInput, lastNameInput, currentName = null) {
	const validationElement = document.querySelector(`#name > .form__field-message`);
	const validationMessage = validationElement.querySelector(".form__field-message-content");
	const firstNameTooLong = !validateFieldLength(firstNameInput, { maxLength: 32 });
	const lastNameTooLong = !validateFieldLength(lastNameInput, { maxLength: 32 });

	if (firstNameTooLong || lastNameTooLong) {
		return;
	}

	if (!firstNameInput.value || !lastNameInput.value) {
		validationMessage.textContent = "";
		validationElement.classList.add("display-none", "animation-none");
		return false;
	}

	const name = `${firstNameInput.value} ${lastNameInput.value}`;
	const nameAvailable = name === currentName || !(await checkAuthorExists(name));

	if (nameAvailable) {
		validationMessage.textContent = "";
		validationElement.classList.add("display-none", "animation-none");
	} else {
		validationElement.classList.remove("display-none", "animation-none");
		validationMessage.textContent = `${strToNameCase(name)} already added.`;
	}

	return nameAvailable;
};

export default validateName;
