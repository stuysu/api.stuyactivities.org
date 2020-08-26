export default async (user, args, { models }) => {
	if (user.isFaculty) {
		return null;
	}

	let id;
	let row = await models.fourDigitIds.userIdLoader.load(user.id);

	if (row) {
		id = row.value;
	} else {
		id = await models.fourDigitIds.userIdCreateLoader.load(user.id);
	}

	return id;
};
