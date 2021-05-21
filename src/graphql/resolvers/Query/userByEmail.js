export default (query, { email }, { models, authenticationRequired }) => {
	authenticationRequired();
	return models.users.findOne({ where: { email } });
};
