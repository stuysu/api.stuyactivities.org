export default (group, args, { models }) => {
	return models.groupMemberships.groupIdLoader.load(group.id);
};
