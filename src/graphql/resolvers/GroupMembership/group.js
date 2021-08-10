export default (groupMembership, args, { models }) => {
	return models.groups.idLoader.load(groupMembership.groupId);
};
