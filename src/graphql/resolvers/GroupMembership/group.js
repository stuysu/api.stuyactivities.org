export default (groupMembership, args, { models }) => {
	return models.group.idLoader.load(groupMembership.groupId);
};
