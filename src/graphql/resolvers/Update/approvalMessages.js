export default (update, params, { models }) => {
	return models.updateApprovalMessages.updateIdLoader.load(update.id);
};
