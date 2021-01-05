export default (root, { limit, offset }, { session, models }) => {
	session.authenticationRequired(['exploreUpdates']);

	return models.updates.findAll({
		limit,
		offset,
		where: {
			type: 'public',
			approval: 'approved'
		},
		order: [['createdAt', 'desc']]
	});
};
