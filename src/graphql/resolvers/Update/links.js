export default (update, params, { models }) => {
	return models.updateLinks.updateIdLoader.load(update.id);
};
