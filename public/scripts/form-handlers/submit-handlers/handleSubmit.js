const handleSubmit = async (e, { form, validationState, validators }) => {
	e.preventDefault();

	for (const [field, validator] of Object.entries(validators)) {
		if (validationState[field]) {
			continue;
		}

		const isValid = await validator();
		validationState[field] = isValid;

		if (!isValid) {
			return;
		}
	}

	const isFormValid = Object.values(validationState).every(Boolean);

	if (isFormValid) {
		form.submit();
	}
};

export default handleSubmit;
