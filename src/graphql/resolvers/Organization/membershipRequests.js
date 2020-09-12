import { ForbiddenError } from 'apollo-server-errors';

export default async (org, args, { models, session }) => {
	const fields = ['membershipRequests'];
	session.authenticationRequired(fields);

	const isOrgAdmin = await session.orgAdminRequired(org.id, fields, true);
	const isAdmin = await session.adminRoleRequired('charters', fields, true);

	if (!isOrgAdmin && !isAdmin) {
		throw new ForbiddenError(
			"You don't have permission to view membership requests for this organization."
		);
	}

	return models.membershipRequests.orgIdLoader.load(org.id);
};
