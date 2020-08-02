export default (edit, args, { models }) => {
	return models.users.idLoader.load(edit.reviewerId);
};
