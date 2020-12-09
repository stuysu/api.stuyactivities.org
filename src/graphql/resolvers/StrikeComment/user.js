export default (message, args, { models }) => {
	return models.users.idLoader.load(message.userId);
};
