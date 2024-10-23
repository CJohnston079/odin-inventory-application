import { checkAuthorExists } from "../../validateInputs.js";

const validateAuthor = async function (authorInput) {
	const authorMessage = document.querySelector(`#${authorInput.id} ~ .field-message`);

	if (!authorInput.value) {
		authorMessage.textContent = "";
		return false;
	}

	const authorExists = await checkAuthorExists(authorInput.value);

	if (authorExists) {
		authorMessage.textContent = "";
	} else {
		authorMessage.textContent = `Author ${authorInput.value} not found.`;

		const newAuthorAnchor = document.createElement("a");
		newAuthorAnchor.href = "../authors/new";
		newAuthorAnchor.textContent = `Add author +`;
		authorMessage.appendChild(newAuthorAnchor);
	}

	return authorExists;
};

export default validateAuthor;
