export default (message, params, { models }) => {
	return models.users.idLoader.load(message.userId);
};
