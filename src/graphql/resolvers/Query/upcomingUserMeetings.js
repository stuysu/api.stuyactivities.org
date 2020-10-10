export default (root, { userId }, { models, session }) => {
	session.authenticationRequired(['upcomingUserMeetings']);

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
		}
	});
};
