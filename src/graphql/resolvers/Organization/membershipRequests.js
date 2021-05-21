import { ForbiddenError } from 'apollo-server-errors';

export default async (
	org,
	args,
	{ models, authenticationRequired, isOrgAdmin, hasAdminRoles }
) => {
	authenticationRequired();

	const orgAdmin = isOrgAdmin(org.id);
	const isAdmin = hasAdminRoles('charters');

	if (!orgAdmin && !isAdmin) {
		throw new ForbiddenError(
			"You don't have permission to view membership requests for this organization."
		);
	}

	return models.membershipRequests.orgIdLoader.load(org.id);
};
