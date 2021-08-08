export default (group, args, { models }) => {
	return models.organizations.idLoader.load(group.organizationId);
};
