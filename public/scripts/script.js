const removeChildren = function (element) {
	while (element.firstChild) {
		element.removeChild(element.lastChild);
	}
};

export async function showSuggestions(
	inputElementId,
	hiddenInputElementId,
	suggestionListId,
	authors
) {
	const inputElement = document.getElementById(inputElementId);
	const suggestionList = document.getElementById(suggestionListId);
	let i = -1;

	inputElement.addEventListener("input", function () {
		const query = this.value.toLowerCase();
		i = -1;

		removeChildren(suggestionList);

		if (query.length > 0) {
			const suggestions = authors.filter(author => {
				const str = author.name.toLowerCase();
				const words = str.split(" ");
				return str.startsWith(query) || words.some(word => word.toLowerCase().startsWith(query));
			});

			suggestions.forEach(suggestion => {
				const li = document.createElement("li");

				li.textContent = suggestion.name;
				li.addEventListener("click", function () {
					document.getElementById(hiddenInputElementId).value = suggestion.id;
					inputElement.value = suggestion.name;

					removeChildren(suggestionList);
				});
				suggestionList.appendChild(li);
			});
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
			console.log(e.key);
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
		document.getElementById(hiddenInputElementId).value = author.id;
		inputElement.value = author.name;

		removeChildren(suggestionList);
	}
}
