export default (membership, args, { models }) => {
	return models.groupMemberships.findAll({
		where: {
			userId: membership.userId,
		},
		include: {
			required: true,
			model: models.groups,
			include: {
				required: true,
				model: models.organizations,
				where: {
					id: membership.organizationId,
				}
			}
		}
	});
};
