export default (query, args, { authenticationRequired, models }) => {
	authenticationRequired();
	return models.meetings.findAll({
		where: {
			groupId: 0,
			privacy: 'public',
			end: {
				[models.Sequelize.Op.gt]: new Date()
			}
		},
		order: [['start', 'asc'], models.sequelize.random()]
	});
};
