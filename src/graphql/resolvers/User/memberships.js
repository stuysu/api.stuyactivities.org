export default (user, args, { models }) => {
	return models.memberships.userIdLoader.load(user.id);
};
