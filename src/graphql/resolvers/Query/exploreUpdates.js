export default (root, args, { session, models }) => {
	session.authenticationRequired(['exploreUpdates']);
	const twoWeeksAgo = new Date();
	twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
	return models.updates.findAll({
		where: {
			type: 'public',
			approval: 'approved',
			createdAt: {
				[models.Sequelize.Op.gt]: twoWeeksAgo
			}
		},
		order: [['createdAt', 'desc']]
	});
};
