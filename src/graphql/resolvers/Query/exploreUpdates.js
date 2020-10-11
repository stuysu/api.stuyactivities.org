export default (root, args, { session, models }) => {
	session.authenticationRequired(['exploreUpdates']);

	return models.updates.findAll({
		where: {
			type: 'public',
			approval: 'approved'
		},
		order: [['createdAt', 'desc']]
	});
};
