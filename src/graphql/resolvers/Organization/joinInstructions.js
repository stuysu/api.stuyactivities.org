export default (org, args, { models }) => {
	if (org.joinInstructions) {
		return org.joinInstructions;
	}

	return models.joinInstructions.orgIdLoader.load(org.id);
};
