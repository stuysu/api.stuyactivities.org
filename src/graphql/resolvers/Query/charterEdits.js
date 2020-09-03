import { ForbiddenError } from 'apollo-server-errors';

export default async (
	root,
	{ pending, status, orgId },
	{ models, session }
) => {
	const fields = ['charterEdits'];
	session.authenticationRequired(fields);

	const isOrgAdmin = await session.orgAdminRequired(orgId, fields, true);
	const isAdmin = await session.adminRoleRequired('charters', fields, true);

	if (!isOrgAdmin && !isAdmin) {
		throw new ForbiddenError(
			"You don't have permission to request charter edits for this organization."
		);
	}

	return await models.charterEdits.orgIdLoader.load(orgId);
};
