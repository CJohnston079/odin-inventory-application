const removeChildren = function (element) {
	while (element.firstChild) {
		element.removeChild(element.lastChild);
	}
};

const getSuggestions = function (query, options) {
	const suggestions = options.filter(option => {
		const str = option.name.toLowerCase();
		const words = str.split(" ");
		return str.startsWith(query) || words.some(word => word.toLowerCase().startsWith(query));
	});

	return suggestions;
};

const renderSuggestions = function (suggestions, suggestionList) {
	suggestions.forEach(suggestion => {
		const suggestionElement = document.createElement("li");
		suggestionElement.classList.add("suggestion");
		suggestionElement.textContent = suggestion.name;

		suggestionElement.addEventListener("click", function () {
			inputElement.value = suggestion.name;
			removeChildren(suggestionList);
		});

		suggestionList.appendChild(suggestionElement);
	});

	suggestionList.firstChild.classList.add("selected");
};

export async function enableAutoComplete(inputElementID, suggestionListId, options) {
	const inputElement = document.getElementById(inputElementID);
	const suggestionList = document.getElementById(suggestionListId);
	let selectedIndex = 0;

	inputElement.addEventListener("input", function () {
		const query = this.value.toLowerCase();
		selectedIndex = 0;

		removeChildren(suggestionList);

		if (query.length > 0) {
			const suggestions = getSuggestions(query, options);
			renderSuggestions(suggestions, suggestionList);
		}
	});

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

	const setSelection = function (suggestions, selectedIndex) {
		if (suggestions.length > 0 && selectedIndex > -1) {
			inputElement.value = suggestions[selectedIndex].textContent;
			removeChildren(suggestionList);
		}
	};
}
