export default (root, args, context) => {
	const { keyword, orgId, orgUrl } = args;
	const {
		tags,
		organizations,
		Sequelize: {
			Op: { or, like }
		}
	} = context.models;

	const orgInclude = {
		model: organizations
	};

	if (orgUrl) {
		orgInclude.where.url = orgUrl;
		orgInclude.required = true;
	}

	if (orgId) {
		orgInclude.where.id = orgId;
		orgInclude.required = true;
	}

	if (!keyword) {
		return tags.findAll({ include: orgInclude });
	}

	const search = `%${keyword}%`;

	return tags.findAll({
		where: {
			[or]: [
				{ name: { [like]: search } },
				{ description: { [like]: search } }
			]
		},
		include: orgInclude
	});
};
