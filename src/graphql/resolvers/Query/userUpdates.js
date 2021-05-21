export default (root, { userId }, { models, authenticationRequired, user }) => {
	authenticationRequired();

	if (user.id !== userId) {
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
		order: [['createdAt', 'desc']]
	});
};
