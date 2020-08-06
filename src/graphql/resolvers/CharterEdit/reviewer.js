export default (edit, args, { models }) => {
	if (!edit.reviewerId) {
		return null;
	}

	return models.users.idLoader.load(edit.reviewerId);
};
