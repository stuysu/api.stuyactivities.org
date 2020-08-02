export default (role, args, { models }) => {
	return models.users.idLoader.load(role.userId);
};
