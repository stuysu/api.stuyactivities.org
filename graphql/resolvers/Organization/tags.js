module.exports = org => {
	// If they were preloaded
	if (org.tags) {
		return org.tags;
	}

	// Otherwise we need to make a query
	return org.getTags();
};
