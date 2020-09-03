import { ForbiddenError } from 'apollo-server-errors';
import charterEdits from '../Organization/charterEdits';

export default async (root, { orgId, status }, { models, session }) => {
	const fields = ['charterEdits'];
	session.authenticationRequired(fields);

	const isOrgAdmin = await session.orgAdminRequired(orgId, fields, true);
	const isAdmin = await session.adminRoleRequired('charters', fields, true);

	if (!isOrgAdmin && !isAdmin) {
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

	return await charterEdits.findAll({ where });
};
