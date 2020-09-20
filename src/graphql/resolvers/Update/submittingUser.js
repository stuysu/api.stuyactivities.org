export default (update, params, { models }) => {
	return models.users.idLoader.load(update.userId);
};
