export default (root, { orgId }, { models }) => {
	return models.clubFairResponses.findOne({
		where: {
			organizationId: orgId
		}
	});
};
