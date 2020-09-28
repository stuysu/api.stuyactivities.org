export default (request, args, { models }) => {
	return models.organizations.idLoader.load(request.organizationId);
};
