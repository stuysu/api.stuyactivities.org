export default (root, { userId }, { models, session }) => {
	session.authenticationRequired(['userUpdates']);

	if (session.userId !== userId) {
		return null;
	}

	return models.updates.findAll({
		include: {
			model: models.organizations,
			include: {
				model: models.memberships,
				where: {
					userId: userId
				},
				required: true
			},
			required: true
		},
		order: [['createdAt', 'asc']]
	});
};
