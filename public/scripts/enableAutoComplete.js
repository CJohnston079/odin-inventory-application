import { sanitiseStr } from "./utils.js";

const enableAutoComplete = function ({
	inputElementID,
	suggestionListID,
	options,
	fieldName,
	addNewRoute,
}) {
	const inputElement = document.getElementById(inputElementID);
	const suggestionList = document.getElementById(suggestionListID);

	let selectedIndex = 0;

	const removeChildren = function (element) {
		while (element.firstChild) {
			element.removeChild(element.lastChild);
		}
	};

	const getSuggestions = function (query) {
		const matchingSuggestions = options.filter(option => {
			const suggestion = sanitiseStr(option[fieldName]);
			const suggestions = suggestion.split(" ");
			return (
				suggestion.startsWith(query) ||
				suggestions.some(suggestion => suggestion.toLowerCase().startsWith(query))
			);
		});
		return matchingSuggestions.slice(0, 4);
	};

	const createAddNewElement = function () {
		const anchorWrapper = document.createElement("li");
		anchorWrapper.classList.add("add-new");

		const addNewAnchor = document.createElement("a");
		addNewAnchor.classList.add("form__input-suggestion--link");
		addNewAnchor.href = `/${addNewRoute}/new`;
		addNewAnchor.textContent = `Add new ${addNewRoute.slice(0, -1)}`;

		anchorWrapper.appendChild(addNewAnchor);

		return anchorWrapper;
	};

	const renderSuggestions = function (suggestions) {
		suggestions.forEach(suggestion => {
			const suggestionElement = document.createElement("li");
			suggestionElement.classList.add("suggestion");
			suggestionElement.textContent = suggestion[fieldName];

			suggestionElement.addEventListener("click", function () {
				inputElement.value = suggestion[fieldName];
				removeChildren(suggestionList);
			});

			suggestionList.appendChild(suggestionElement);
		});

		if (addNewRoute) {
			const addNewElement = createAddNewElement();
			suggestionList.appendChild(addNewElement);
		}

		if (suggestions.length > 0) {
			suggestionList.firstChild.classList.add("form__input-suggestion--selected");
		}
	};

	inputElement.addEventListener("input", function () {
		const query = sanitiseStr(inputElement.value);
		selectedIndex = 0;

		removeChildren(suggestionList);

		if (query.length > 0) {
			const suggestions = getSuggestions(query);
			renderSuggestions(suggestions);
		}
	});

	const updateSelection = function ({ suggestions, incrementSelection = true }) {
		if (incrementSelection) {
			selectedIndex = (selectedIndex + 1) % suggestions.length;
		} else {
			selectedIndex = selectedIndex = (selectedIndex - 1 + suggestions.length) % suggestions.length;
		}

		suggestions.forEach((suggestion, i) => {
			suggestion.classList.toggle("form__input-suggestion--selected", i === selectedIndex);
		});
	};

	const setSelection = function (suggestions) {
		if (suggestions.length > 0 && selectedIndex > -1) {
			inputElement.value = suggestions[selectedIndex].textContent;
			removeChildren(suggestionList);
		}
	};

	inputElement.addEventListener("keydown", function (e) {
		const suggestions = suggestionList.querySelectorAll(".suggestion");
		const keyActions = {
			ArrowDown: () => updateSelection({ suggestions }),
			ArrowUp: () => updateSelection({ suggestions, incrementSelection: false }),
			Enter: () => setSelection(suggestions, selectedIndex),
			Tab: () => setSelection(suggestions, selectedIndex),
			Escape: () => removeChildren(suggestionList),
		};

		if (keyActions[e.key]) {
			keyActions[e.key]();
		}
	});

	inputElement.addEventListener("blur", () => {
		if (suggestionList.children.length > 0) {
			setTimeout(() => {
				removeChildren(suggestionList);
			}, 100);
		}
	});
};

export default enableAutoComplete;
