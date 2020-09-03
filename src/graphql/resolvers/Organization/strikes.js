import { ForbiddenError } from 'apollo-server-errors';

export default async (org, args, { models, session }) => {
	const fields = ['strikes'];
	session.authenticationRequired(fields);

	const isOrgAdmin = await session.orgAdminRequired(org.id, fields, true);
	const isAdmin = await session.adminRoleRequired('strikes', fields, true);

	if (!isOrgAdmin && !isAdmin) {
		throw new ForbiddenError(
			"You don't have permission to view strikes for this organization."
		);
	}

	return models.strikes.orgIdLoader.load(org.id);
};
