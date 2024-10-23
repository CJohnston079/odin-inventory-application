import handleSubmit from "./handleSubmit.js";

const submitOnEnter = async function (e, { form, validationState, validators }) {
	if (e.key === "Enter") {
		e.preventDefault();
		await handleSubmit(e, { form, validationState, validators });
	}
};

export default submitOnEnter;
