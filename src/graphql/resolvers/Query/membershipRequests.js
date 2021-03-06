import { ForbiddenError } from 'apollo-server-errors';

export default async (
	parent,
	{ orgId },
	{ models, authenticationRequired, isOrgAdmin, hasAdminRole }
) => {
	authenticationRequired();

	const orgAdmin = isOrgAdmin(orgId);
	const isAdmin = hasAdminRole('charters');

	if (!orgAdmin && !isAdmin) {
		throw new ForbiddenError(
			"You don't have permission to view membership requests for this organization."
		);
	}

	return models.membershipRequests.orgIdLoader.load(orgId);
};
