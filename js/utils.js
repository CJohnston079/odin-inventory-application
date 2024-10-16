const capitalise = str => {
	const firstAlphaIndex = [...str].findIndex(char => /[\D\S]/.test(char));

	return (
		str.slice(0, firstAlphaIndex) +
		str.charAt(firstAlphaIndex).toUpperCase() +
		str.slice(firstAlphaIndex + 1)
	);
};

exports.slugToStr = str => str.trim().split("-").map(capitalise).join(" ");

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

exports.strToNameCase = function (str, options = {}) {
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

exports.strToTitleCase = function (str) {
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

exports.groupDecadesByCentury = function (decades) {
	const groupedDecades = decades.reduce((centuries, decadeEntry) => {
		const decade = Number(decadeEntry.decade, 10);
		const century = Math.floor(decade / 100) * 100;

		if (centuries[century]) {
			centuries[century] = centuries[century].concat([decadeEntry]);
		} else {
			centuries[century] = [decadeEntry];
		}

		return centuries;
	}, {});

	return groupedDecades;
};
