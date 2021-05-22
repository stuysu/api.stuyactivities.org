import { ForbiddenError } from 'apollo-server-errors';

export default async (
	org,
	args,
	{ models, isOrgAdmin, hasAdminRole, authenticationRequired }
) => {
	authenticationRequired();

	const orgAdmin = isOrgAdmin(org.id);
	const isAdmin = hasAdminRole('strikes');

	if (!orgAdmin && !isAdmin) {
		throw new ForbiddenError(
			"You don't have permission to view strikes for this organization."
		);
	}

	return models.strikes.orgIdLoader.load(org.id);
};
