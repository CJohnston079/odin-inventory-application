import { sanitiseStr } from "./utils.js";

const enableAutoCompleteMulti = function ({
	inputElementID,
	suggestionListID,
	options,
	fieldName,
}) {
	const inputElement = document.getElementById(inputElementID);
	const suggestionList = document.getElementById(suggestionListID);

	let selectedIndex = 0;

	const removeChildren = function (element) {
		while (element.firstChild) {
			element.removeChild(element.lastChild);
		}
	};

	const getSuggestions = function (query, entries) {
		const sanitisedEntries = entries.map(sanitiseStr);
		const matchingSuggestions = options.filter(option => {
			const suggestion = sanitiseStr(option[fieldName]);
			const suggestions = suggestion.split(" ");
			return (
				!sanitisedEntries.some(entry => suggestions.includes(entry)) &&
				(suggestion.startsWith(query) ||
					suggestions.some(word => word.toLowerCase().startsWith(query)))
			);
		});
		return matchingSuggestions.slice(0, 4);
	};

	const updateInput = function (input, newEntry) {
		const entries = input.value.replaceAll(" ", "").split(",").slice(0, -1);
		entries.push(newEntry);
		input.value = entries.join(", ");
	};

	const renderSuggestions = function (suggestions) {
		suggestions.forEach(suggestion => {
			const suggestionElement = document.createElement("li");
			suggestionElement.classList.add("suggestion");
			suggestionElement.textContent = suggestion[fieldName];

			suggestionElement.addEventListener("click", function () {
				const newEntry = suggestion[fieldName];
				updateInput(inputElement, newEntry);
				removeChildren(suggestionList);
			});

			suggestionList.appendChild(suggestionElement);
		});

		if (suggestions.length > 0) {
			suggestionList.firstChild.classList.add("selected");
		}
	};

	inputElement.addEventListener("input", function () {
		const query = inputElement.value;
		const entries = query.replaceAll(" ", "").split(",");
		const newEntry = sanitiseStr(entries[entries.length - 1]);
		selectedIndex = 0;

		removeChildren(suggestionList);

		if (entries[entries.length - 1].length > 0) {
			const suggestions = getSuggestions(newEntry, entries);
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
			const newEntry = suggestions[selectedIndex].textContent;
			updateInput(inputElement, newEntry);
			removeChildren(suggestionList);
		}
	};

	inputElement.addEventListener("keydown", function (e) {
		const suggestions = suggestionList.querySelectorAll(".suggestion");
		const keyActions = {
			ArrowDown: () => updateSelection({ suggestions }),
			ArrowUp: () => updateSelection({ suggestions, incrementSelection: false }),
			Enter: () => setSelection(suggestions),
			Tab: () => {
				if (suggestions.length > 0 && selectedIndex > -1) {
					e.preventDefault();
					setSelection(suggestions, e);
				}
			},
		};

		if (keyActions[e.key]) {
			keyActions[e.key]();
		}
	});
};

export default enableAutoCompleteMulti;
