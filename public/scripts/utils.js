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
	const genreStr = `Gerne${hasMultipleItems ? "s" : ""} ${str} not found.`;

	return genreStr;
};
