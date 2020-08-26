export default async (user, args, { models }) => {
	if (user.isFaculty) {
		return null;
	}

	let id = models.fourDigitIds.userIdLoader.load(user.id);

	if (!id) {
		id = models.fourDigitIds.userIdCreateLoader(user.id);
	}

	return id;
};
