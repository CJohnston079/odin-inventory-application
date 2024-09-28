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

exports.capitaliseArray = function (arr) {
	return arr.map(str => {
		const words = str.trim().toLowerCase().split(/\s+/);
		const capitalisedWords = words
			.map(word => (word = word.charAt(0).toUpperCase() + word.slice(1)))
			.join(" ");
		return capitalisedWords;
	});
};
