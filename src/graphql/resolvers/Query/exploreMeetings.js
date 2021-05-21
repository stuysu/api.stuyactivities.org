export default (query, args, { authenticationRequired, models }) => {
	authenticationRequired();
	return models.meetings.findAll({
		where: {
			privacy: 'public',
			end: {
				[models.Sequelize.Op.gt]: new Date()
			}
		},
		order: [['start', 'asc'], models.sequelize.random()]
	});
};
