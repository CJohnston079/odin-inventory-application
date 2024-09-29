const capitalise = str => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

exports.capitaliseArray = function (arr) {
	return arr.map(str => {
		const words = str.trim().toLowerCase().split(/\s+/);
		const capitalisedWords = words.map(capitalise).join(" ");
		return capitalisedWords;
	});
};

exports.strToSlug = function (str) {
	return str
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^a-z0-9\s-]/g, "")
		.trim()
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-");
};

exports.strToTitleCase = function (str) {
	const articles = ["a", "an", "the"];
	const conjunctions = ["and", "but", "if", "or", "nor"];
	const prepositions = ["as", "at", "by", "for", "in", "of", "on", "per", "to", "via"];
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
