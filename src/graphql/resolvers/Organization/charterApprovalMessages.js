import { ForbiddenError } from 'apollo-server-errors';

export default async (
	org,
	args,
	{ models, authenticationRequired, isOrgAdmin, hasAdminRole }
) => {
	authenticationRequired();

	const orgAdmin = isOrgAdmin(org.id);
	const isAdmin = hasAdminRole('charters');

	if (!orgAdmin && !isAdmin) {
		throw new ForbiddenError(
			"You don't have permission to view charter approval messages for this organization."
		);
	}
	return models.charterApprovalMessages.orgIdLoader.load(org.id);
};
