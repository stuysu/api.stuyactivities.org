import { ForbiddenError } from 'apollo-server-errors';

export default async (parent, { orgId }, { models, session }) => {
	const fields = ['charterApprovalMessages'];
	session.authenticationRequired(fields);

	const isOrgAdmin = await session.orgAdminRequired(orgId, fields, true);

	if (!isOrgAdmin) {
		throw new ForbiddenError(
			"You don't have permission to view membership requests for this organization."
		);
	}

	if (!orgId) {
		return null;
	}

	return models.membershipRequests.orgIdLoader.load(orgId);
};
