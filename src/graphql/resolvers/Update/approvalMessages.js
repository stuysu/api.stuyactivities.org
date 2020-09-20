export default async (update, params, { models, session }) => {
	session.authenticationRequired();

	const isOrgAdmin = await session.orgAdminRequired(
		update.organizationId,
		[],
		true
	);
	const isSUAdmin = await session.adminRoleRequired('updates', [], true);

	if (!isOrgAdmin && !isSUAdmin) {
		return null;
	}

	return models.updateApprovalMessages.updateIdLoader.load(update.id);
};
