export default (promotedClub, args, { models }) => {
	return models.organizations.idLoader.load(promotedClub.organizationId);
};
