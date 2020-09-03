import { ForbiddenError } from 'apollo-server-errors';

export default async (org, args, context) => {
	const fields = ['charterApprovalMessages'];
	context.session.authenticationRequired(fields);

	const isOrgAdmin = await context.session.orgAdminRequired(
		org.id,
		fields,
		true
	);
	const isAdmin = await context.session.adminRoleRequired(
		'charters',
		fields,
		true
	);

	if (!isOrgAdmin && !isAdmin) {
		throw new ForbiddenError(
			"You don't have permission to view charter edits for this organization."
		);
	}

	return context.models.charterEdits.orgIdLoader.load(org.id);
};
