export default (strike, args, { models }) => {
	return models.organizations.idLoader.load(strike.organizationId);
};
