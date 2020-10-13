export default (query, args, { session, models }) => {
	session.authenticationRequired(['exploreMeetings']);
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
