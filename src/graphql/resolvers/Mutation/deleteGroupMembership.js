export default async (
	root,
	{ groupMembershipId },
	{ orgAdminRequired, models: { groupMemberships }, user }
) => {
	const groupMembership = await groupMemberships.idLoader.load(
		groupMembershipId
	);

	if (!groupMembership) {
		throw new ApolloError(
			"There's no group membership with that id",
			'ID_NOT_FOUND'
		);
	}

	const group = await groups.idLoader.load(groupMembership.groupId);

	if (!group) {
		throw new ApolloError(
			"There's no group associated with that Membership",
			'ID_NOT_FOUND'
		);
	}

	orgAdminRequired(group.organizationId);

	return await groupMembership.destroy();
};
