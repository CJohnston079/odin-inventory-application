import { checkAuthorExists } from "../../validateInputs.js";

const validateName = async function (firstNameInput, lastNameInput, currentName = null) {
	const nameMessage = document.querySelector(`#${firstNameInput.id} ~ .field-message`);

	if (!firstNameInput.value || !lastNameInput.value) {
		nameMessage.textContent = "";
		return false;
	}

	const name = `${firstNameInput.value} ${lastNameInput.value}`;
	const nameAvailable = name === currentName || !(await checkAuthorExists(name));

	if (nameAvailable) {
		nameMessage.textContent = "";
	} else {
		nameMessage.textContent = `${name} already added.`;
	}

	return nameAvailable;
};

export default validateName;
