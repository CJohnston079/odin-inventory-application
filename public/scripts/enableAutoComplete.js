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
		suggestionElement.textContent = suggestion.name;

		suggestionElement.addEventListener("click", function () {
			inputElement.value = suggestion.name;
			removeChildren(suggestionList);
		});

		suggestionList.appendChild(suggestionElement);
	});
};

export async function enableAutoComplete(inputElementId, suggestionListId, options) {
	const inputElement = document.getElementById(inputElementId);
	const suggestionList = document.getElementById(suggestionListId);
	let i = -1;

	inputElement.addEventListener("input", function () {
		const query = this.value.toLowerCase();
		i = -1;

		removeChildren(suggestionList);

		if (query.length > 0) {
			const suggestions = getSuggestions(query, options);
			renderSuggestions(suggestions, suggestionList);
		}
	});

	inputElement.addEventListener("keydown", function (e) {
		const suggestions = suggestionList.querySelectorAll("li");

		const keyActions = {
			ArrowDown: () => {
				i = (i + 1) % suggestions.length;
				updateSelection(suggestions);
			},
			ArrowUp: () => {
				i = (i - 1 + suggestions.length) % suggestions.length;
				updateSelection(suggestions);
			},
			Enter: () => {
				if (i > -1) {
					selectAuthor({ name: suggestions[i].textContent });
				}
			},
			Tab: () => {
				if (i > -1) {
					selectAuthor({ name: suggestions[i].textContent });
					e.preventDefault();
				}
			},
		};

		if (keyActions[e.key]) {
			keyActions[e.key]();
			e.preventDefault();
		}
	});

	function updateSelection(suggestions) {
		suggestions.forEach((suggestion, index) => {
			suggestion.classList.toggle("selected", index === i);
		});
	}

	function selectAuthor(author) {
		inputElement.value = author.name;

		removeChildren(suggestionList);
	}
}
