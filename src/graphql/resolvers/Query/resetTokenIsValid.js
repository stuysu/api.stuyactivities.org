export default async (root, { token }, { models }) => {
	const { passwordResets } = models;

	const entry = await passwordResets.findOne({ where: { token } });

	if (!entry) {
		return false;
	}

	const now = new Date();

	// One hour
	const maxAge = 1000 * 60 * 60;

	const validUntil = entry.createdAt.getTime() + maxAge;

	if (validUntil < now.getTime()) {
		await entry.destroy();
		return false;
	}

	return true;
};
