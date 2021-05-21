export default (root, { userId }, { models, authenticationRequired }) => {
	authenticationRequired();

	const now = new Date();

	return models.meetings.findAll({
		where: {
			end: {
				[models.Sequelize.Op.gte]: now
			}
		},
		include: {
			model: models.organizations,
			required: true,
			include: {
				model: models.memberships,
				required: true,
				where: {
					userId
				}
			}
		},
		order: [['start', 'asc']]
	});
};
