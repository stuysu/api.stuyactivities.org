export default (message, args, { models }) => {
	return models.organizations.idLoader.load(message.organizationId);
};
