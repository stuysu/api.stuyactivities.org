export default async (
	parent,
	{ keyword, limit, offset },
	{ models, authenticationRequired }
) => {
	authenticationRequired();
	const {
		users,
		Sequelize: { Op }
	} = models;

	const keywords = keyword.split(' ').filter(Boolean);

	const fieldsToCheck = ['firstName', 'lastName', 'email', 'gradYear'];

	const conditions = keywords.map(word => {
		return {
			[Op.or]: fieldsToCheck.map(field => {
				return {
					[field]: {
						[Op.like]: `%${word}%`
					}
				};
			})
		};
	});

	return users.findAll({
		where: {
			[Op.and]: conditions
		},
		limit,
		offset
	});
};
