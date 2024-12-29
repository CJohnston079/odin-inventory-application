const currentPath = window.location.pathname;
const linkItems = {
	home: document.querySelector(".nav-bar__nav-item:first-child"),
	categories: document.querySelectorAll("#nav-main .nav-bar__nav-item"),
	add: document.querySelectorAll("#nav-secondary .nav-bar__nav-item"),
};

const setActiveLink = function (linkItems) {
	linkItems.forEach(link => {
		if (!currentPath.includes(link.querySelector(".nav-bar__nav-link").getAttribute("href"))) {
			return;
		}

		link.classList.add("nav-bar__nav-item--active");
	});
};

if (currentPath === "/") {
	linkItems.home.classList.add("nav-bar__nav-item--active");
} else if (currentPath.includes("new")) {
	setActiveLink(linkItems.add);
} else {
	setActiveLink(linkItems.categories);
}
