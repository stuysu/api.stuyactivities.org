export default (org, args, { models }) => {
	// If they were preloaded
	if (org.tags) {
		return org.tags;
	}

	// Otherwise we need to make a query
	return models.tags.orgIdLoader.load(org.id);
};
