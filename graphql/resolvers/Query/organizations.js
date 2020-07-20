module.exports = async (root, args, context) => {
	const {
		with: { keyword, tags, commitmentLevels },
		limit,
		offset
	} = args;

	const models = context;

	// add filtering for tags and the keyword as well as commitment levels

	return models.organizations.findAll({
		// where: {
		//
		// }
		include: [{ model: models.tags }],
		limit,
		offset
	});
};
