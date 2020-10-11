export default (query, args, { session, models }) => {
	session.authenticationRequired(['exploreMeetings']);
	return models.meetings.findAll({
		where: {
			privacy: 'public'
		},
		order: [['start', 'desc']]
	});
};
