import { sanitiseStr } from "./utils.js";

const enableAutoComplete = function ({ inputElementID, suggestionListID, options, fieldName }) {
	const inputElement = document.getElementById(inputElementID);
	const suggestionList = document.getElementById(suggestionListID);

	let selectedIndex = 0;

	const removeChildren = function (element) {
		while (element.firstChild) {
			element.removeChild(element.lastChild);
		}
	};

	const getSuggestions = function (query) {
		return options.filter(option => {
			const str = sanitiseStr(option[fieldName]);
			const words = str.split(" ");
			return str.startsWith(query) || words.some(word => word.toLowerCase().startsWith(query));
		});
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

		if (suggestions.length > 0) {
			suggestionList.firstChild.classList.add("selected");
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
			suggestion.classList.toggle("selected", i === selectedIndex);
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
		};

		if (keyActions[e.key]) {
			keyActions[e.key]();
		}
	});
};

export default enableAutoComplete;
