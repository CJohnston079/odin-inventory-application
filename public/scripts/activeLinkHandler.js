const currentPath = window.location.pathname;
const linkItems = {
	home: document.querySelector(".nav-item:first-child"),
	categories: document.querySelectorAll("#nav-main .nav-item"),
	add: document.querySelectorAll("#nav-secondary .nav-item"),
};

const setActiveLink = function (linkItems) {
	linkItems.forEach(link => {
		if (!currentPath.includes(link.querySelector(".nav-link").getAttribute("href"))) {
			return;
		}

		link.classList.add("active");
	});
};

if (currentPath === "/") {
	linkItems.home.classList.add("active");
} else if (currentPath.includes("new")) {
	setActiveLink(linkItems.add);
} else {
	setActiveLink(linkItems.categories);
}
