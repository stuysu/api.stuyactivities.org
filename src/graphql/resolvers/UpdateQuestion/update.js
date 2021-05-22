export default (updateQuestion, params, { models }) => {
	return models.updates.idLoader.load(updateQuestion.updateId);
};
