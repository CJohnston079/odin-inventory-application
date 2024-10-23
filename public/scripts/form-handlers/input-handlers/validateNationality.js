import { checkNationalityExists } from "../../validateInputs.js";

const validateNationality = async function (nationalityInput) {
	const nationalityMessage = document.querySelector(`#${nationalityInput.id} ~ .field-message`);
	const isNationalityValid = await checkNationalityExists(nationalityInput.value);

	if (isNationalityValid) {
		nationalityMessage.textContent = "";
	} else {
		nationalityMessage.textContent = `Nationality ${nationalityInput.value} not found.`;
	}

	return isNationalityValid;
};

export default validateNationality;
