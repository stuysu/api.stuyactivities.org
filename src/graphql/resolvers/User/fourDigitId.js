export default (user, args, { models }) => {
	if (user.isFaculty) {
		return null;
	}

	return models.fourDigitIds.userIdLoader.load(user.id);
};
