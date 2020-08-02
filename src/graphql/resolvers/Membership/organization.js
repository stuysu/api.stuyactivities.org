export default (membership, args, { models }) => {
	return models.organizations.idLoader.load(membership.organizationId);
};
