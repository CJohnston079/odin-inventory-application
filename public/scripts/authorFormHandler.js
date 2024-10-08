import enableAutoComplete from "./enableAutoComplete.js";

const form = document.querySelector("#new-author");

const firstNameInput = document.querySelector("#first-name");
const lastNameInput = document.querySelector("#last-name");
const yearInput = document.querySelector("#birth-year");
const nationalityInput = document.querySelector("#nationality");

const nationalities = await fetch("../countries/nationality-names")
	.then(response => response.json())
	.then(data => data.nationalities);

enableAutoComplete({
	inputElementID: "nationality",
	suggestionListID: "nationality-suggestions",
	options: nationalities,
	fieldName: "nationality",
});
