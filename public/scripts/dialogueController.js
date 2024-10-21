const dialogueWrappers = document.querySelectorAll(".dialogue-wrapper");

dialogueWrappers.forEach(wrapper => {
	const dialogue = wrapper.querySelector("dialog");
	const showButton = wrapper.querySelector("dialog + button");
	const closeButton = wrapper.querySelector("dialog button");

	showButton.addEventListener("click", () => {
		dialogue.showModal();
	});

	closeButton.addEventListener("click", () => {
		dialogue.close();
	});
});
