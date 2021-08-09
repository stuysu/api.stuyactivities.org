export default (groupMembership, args, { models }) => {
	return models.users.idLoader.load(groupMembership.userId);
};
