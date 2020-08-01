export default async (parent, { keyword }, { models, session }) => {
	session.authenticationRequired(['users']);

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
		}
	});
};
