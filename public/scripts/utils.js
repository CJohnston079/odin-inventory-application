const capitalise = str => {
	const firstAlphaIndex = [...str].findIndex(char => /[\D\S]/.test(char));

	return (
		str.slice(0, firstAlphaIndex) +
		str.charAt(firstAlphaIndex).toUpperCase() +
		str.slice(firstAlphaIndex + 1)
	);
};

export const sanitiseStr = function (str) {
	return str
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^a-z0-9\s-]/g, "")
		.trim()
		.replace(/\s+/g, " ")
		.replace(/-+/g, " ");
};

export const joinArrWithConjunctions = function (arr) {
	if (!Array.isArray(arr)) {
		throw new TypeError("Input must be an array");
	}

	if (arr.length === 1) {
		return arr[0];
	} else if (arr.length === 2) {
		return arr.join(" and ");
	} else {
		const firstItems = arr.slice(0, -1);
		const lastItem = arr[arr.length - 1];

		return `${firstItems.join(", ")}, and ${lastItem}`;
	}
};

export const formatGenreStr = function (str) {
	const hasMultipleItems = /\s+(,|and)\s+/.test(str);
	const genreStr = `Genre${hasMultipleItems ? "s" : ""} ${strToTitleCase(str)} not found.`;

	return genreStr;
};

export const strToNameCase = function (str, options = {}) {
	const { isSurname = false } = options;

	const nobility = ["al", "bin", "bint", "ibn", "van", "von"];
	const locative = ["da", "de", "del", "della", "di", "dos", "du", "vom", "zu"];
	const articles = ["la", "las", "le", "los"];
	const particles = [...nobility, ...locative, ...articles];

	const names = str.trim().split(/\s+/);
	const nameCaseNames = names
		.map((name, i) => {
			const isParticle = particles.includes(name.toLowerCase());
			const isCompoundName = names.length > 1;
			const isNotLast = isCompoundName && isSurname && i < names.length - 1;

			if (isParticle && isNotLast) {
				return name.toLowerCase();
			}

			if (name.includes("-")) {
				return name.split("-").map(capitalise).join("-");
			}

			return capitalise(name);
		})
		.join(" ");

	return nameCaseNames;
};

export const strToTitleCase = function (str) {
	const articles = ["a", "an", "de", "di", "en", "the"];
	const conjunctions = ["and", "but", "if", "or", "nor"];
	const prepositions = ["as", "at", "by", "for", "from", "in", "of", "on", "per", "to", "via"];
	const versus = ["vs.", "vs", "v.", "v"];
	const allMinorWords = [...articles, ...conjunctions, ...prepositions, ...versus];

	const words = str.trim().split(/\s+/);
	const titleCaseWords = words
		.map((word, i) => {
			const isFirstOrLastWord = i === 0 || i === words.length - 1;
			const isMinorWord = allMinorWords.includes(word.toLowerCase());

			if (!isFirstOrLastWord && isMinorWord) {
				return word.toLowerCase();
			}

			if (word.includes("-")) {
				return word.split("-").map(capitalise).join("-");
			}

			return capitalise(word);
		})
		.join(" ");

	return titleCaseWords;
};
