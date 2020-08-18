export default (membership, args, { models }) => {
	if (membership.user) {
		return membership.user;
	}

	return models.users.idLoader.load(membership.userId);
};
