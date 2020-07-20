module.exports = async (root, args, context) => {
	const {
		with: { keyword, tags, commitmentLevels },
		limit,
		offset
	} = args;

	const { models } = context;

	const filterParams = {
		where: {},
		include: [],
		limit,
		offset
	};

	if (keyword) {
		filterParams.where.name = {
			[models.Sequelize.Op.like]: `%${keyword.trim()}%`
		};
	}

	if (Array.isArray(tags)) {
		filterParams.include.push({
			model: models.tags,
			where: {
				name: tags
			},
			required: true
		});
	}

	if (Array.isArray(commitmentLevels)) {
		filterParams.where.commitmentLevel = commitmentLevels;
	}

	return models.organizations.findAll(filterParams);
};
