module.exports = (root, args, context) => {
	const { keyword } = args;
	const {
		tags,
		Sequelize: {
			Op: { or, like }
		}
	} = context.models;

	if (!keyword) {
		return tags.findAll();
	}

	const search = `%${keyword}%`;

	return tags.findAll({
		where: {
			[or]: [
				{ name: { [like]: search } },
				{ description: { [like]: search } }
			]
		}
	});
};
