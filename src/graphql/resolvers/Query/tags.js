export default (root, args, context) => {
	const { keyword, orgId, orgUrl } = args;
	const {
		tags,
		organizations,
		Sequelize: {
			Op: { or, like }
		}
	} = context.models;

	const include = [];

	if (orgUrl || orgId) {
		const orgInclude = {
			model: organizations,
			where: {}
		};
		orgInclude.required = true;

		if (orgId) {
			orgInclude.where.id = orgId;
		}

		if (orgUrl) {
			orgInclude.where.url = orgUrl;
		}

		include.push(orgInclude);
	}

	const search = `%${keyword || ''}%`;

	const where = {
		[or]: [
			{ name: { [like]: search } },
			{ description: { [like]: search } }
		]
	};

	return tags.findAll({
		where,
		include
	});
};
