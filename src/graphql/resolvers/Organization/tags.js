export default (org, args, { models }) => {
	// Otherwise we need to make a query
	return models.tags.orgIdLoader.load(org.id);
};
