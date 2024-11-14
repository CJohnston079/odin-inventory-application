import { checkAuthorExists } from "../../validateInputs.js";
import { strToNameCase } from "../../utils.js";

const validateAuthor = async function (authorInput) {
	const validationElement = document.querySelector(`#${authorInput.id} ~ .field-message`);
	const validationMessage = validationElement.querySelector(".message-content");

	if (!authorInput.value) {
		validationMessage.textContent = "";
		validationElement.classList.add("display-none", "animation-none");
		return false;
	}

	const authorExists = await checkAuthorExists(authorInput.value);

	if (authorExists) {
		validationMessage.textContent = "";
		validationElement.classList.add("display-none", "animation-none");
	} else {
		validationElement.classList.remove("display-none", "animation-none");
		validationMessage.textContent = `Author ${strToNameCase(authorInput.value)} not found.`;

		const newAuthorAnchor = document.createElement("a");
		newAuthorAnchor.href = "../authors/new";
		newAuthorAnchor.textContent = `Add author`;
		validationMessage.appendChild(newAuthorAnchor);
	}

	return authorExists;
};

export default validateAuthor;
