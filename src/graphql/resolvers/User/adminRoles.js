export default (user, args, { models }) => {
	return models.adminRoles.userIdLoader.load(user.id);
};
