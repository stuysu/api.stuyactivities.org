import { ForbiddenError } from 'apollo-server-errors';

export default async (
	root,
	{ orgId, status },
	{ models, authenticationRequired, isOrgAdmin, hasAdminRole }
) => {
	authenticationRequired();

	const orgAdmin = isOrgAdmin(orgId);
	const isAdmin = hasAdminRole('charters');

	if (!orgAdmin && !isAdmin) {
		throw new ForbiddenError(
			"You don't have permission to request charter edits for this organization."
		);
	}

	const where = {
		organizationId: orgId
	};

	if (status) {
		where.status = status;
	}

	return await models.charterEdits.findAll({ where });
};
