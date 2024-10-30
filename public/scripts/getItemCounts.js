const itemCounts = { books: 192, authors: 32, genres: 28, decades: 21, countries: 17 };

document.querySelectorAll(".item-count").forEach(span => {
	const item = span.getAttribute("data-item");

	if (itemCounts[item]) {
		span.textContent = itemCounts[item];
	}
});
