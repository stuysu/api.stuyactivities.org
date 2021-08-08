export default async (
	root,
	{ orgId, name },
	{ orgAdminRequired, models: { groups }, user }
) => {
	orgAdminRequired(orgId);

	if (!orgId || !name) {
		throw new UserInputError(
			'You must provide an organization id and a group name.',
			{ invalidArgs: ['createGroup'] }
		);
	}

	return await groups.create({
		organizationId: orgId,
		name,
	});
}