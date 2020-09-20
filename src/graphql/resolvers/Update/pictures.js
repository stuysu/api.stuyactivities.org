export default (update, params, { models }) => {
	return models.updatePics.updateIdLoader.load(update.id);
};
