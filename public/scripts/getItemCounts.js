const itemCounts = await fetch("/get-item-counts")
	.then(response => response.json())
	.then(data => data.itemCounts);

document.querySelectorAll(".item-count").forEach(span => {
	const item = span.getAttribute("data-item");

	if (itemCounts[item]) {
		span.textContent = itemCounts[item];
	}
});
