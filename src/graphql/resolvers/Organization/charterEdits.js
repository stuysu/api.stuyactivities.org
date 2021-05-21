import { ForbiddenError } from 'apollo-server-errors';

export default async (
	org,
	args,
	{
		authenticationRequired,
		isOrgAdmin,
		hasAdminRole,
		models: { charterEdits }
	}
) => {
	authenticationRequired();

	const orgAdmin = isOrgAdmin(org.id);
	const isAdmin = hasAdminRole('charters');

	if (!orgAdmin && !isAdmin) {
		throw new ForbiddenError(
			"You don't have permission to view charter edits for this organization."
		);
	}

	return charterEdits.orgIdLoader.load(org.id);
};
