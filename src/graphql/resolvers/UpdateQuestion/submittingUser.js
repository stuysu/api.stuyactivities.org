export default (updateQuestion, params, { models }) => {
	return models.users.idLoader.load(updateQuestion.userId);
};
