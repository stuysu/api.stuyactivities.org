export default async (
	root,
	{ groupId },
	{ orgAdminRequired, models: { groups }, user }
) => {
	const group = await groups.idLoader.load(groupId);

	if (!group) {
		throw new ApolloError("There's no group with that id", 'ID_NOT_FOUND');
	}

	orgAdminRequired(group.organizationId);

	return await group.destroy();
};
