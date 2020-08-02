export default (org, args, { models }) => {
	if (org.charter) {
		return org.charter;
	}

	return models.charters.orgIdLoader.load(org.id);
};
