export default org => {
	if (org.charter) {
		return org.charter;
	}

	return org.getCharter();
};
