import validateFieldLength from "./validateFieldLength.js";
import { checkAuthorExists } from "../../validateInputs.js";
import { strToNameCase } from "../../utils.js";

const validateName = async function (firstNameInput, lastNameInput, currentName = null) {
	const nameMessage = document.querySelector(`#${firstNameInput.id} ~ .field-message:last-child`);
	const firstNameTooLong = !validateFieldLength(firstNameInput, { maxLength: 32 });
	const lastNameTooLong = !validateFieldLength(lastNameInput, { maxLength: 32 });

	if (firstNameTooLong || lastNameTooLong) {
		return;
	}

	if (!firstNameInput.value || !lastNameInput.value) {
		nameMessage.textContent = "";
		return false;
	}

	const name = `${firstNameInput.value} ${lastNameInput.value}`;
	const nameAvailable = name === currentName || !(await checkAuthorExists(name));

	if (nameAvailable) {
		nameMessage.textContent = "";
	} else {
		nameMessage.textContent = `${strToNameCase(name)} already added.`;
	}

	return nameAvailable;
};

export default validateName;
